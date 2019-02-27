import { Observable, Subscription } from 'rxjs';
import { keys } from 'src/util/util';
import { AsyncComponent, Component, CreateElement, VNode, VNodeChildren, VNodeData, VueConstructor } from 'vue';
import { Component as ComponentDecorator } from 'vue-property-decorator';
import { TsxComponent } from './tsx-component';

export interface StateProps<TState> {
  setState(update: (state: TState) => TState): void;
  patchState(update: (state: TState) => Partial<TState>): void;
}

export interface LifecycleHooks<TState, TProps> {
  created?(args: StatefulComponentArgs<TState, TProps>): unknown;
  mounted?(args: StatefulComponentArgs<TState, TProps>, element: HTMLElement): unknown;
}

export type StatefulComponentArgs<TState, TProps> = Readonly<
  ResolvedObservableProperties<ObservableProperties<TProps>>
  & NonObservableProperties<TProps>
  & TState
  & StateProps<TState>
>;

const createElementFuncs: (CreateElement | undefined)[] = [];

export function stateful<TState, TProps = {}>(
  initialState: TState,
  observableProps: ObservableProperties<TProps>,
  render: (args: StatefulComponentArgs<TState, TProps>) => JSX.Element | null,
  lifecycleHooks: LifecycleHooks<TState, TProps> = {},
): { new(): TsxComponent<NonObservableProperties<TProps>> } & VueConstructor {
  const name = (render.name || 'StatefulComponent').replace(/Def$/g, '');
  return ComponentDecorator({})(
    class extends TsxComponent<NonObservableProperties<TProps>> {
      // we laziliy initialize the state when the component is created to
      // prevent vue from making the state reactive
      private state: TState = initialState;
      private resolvedObservableProps: ResolvedObservableProperties<ObservableProperties<TProps>>;

      private subscriptions: Subscription[];

      // @ts-ignore
      static get name() {
        return name;
      }

      // TODO: cache this?
      get props(): NonObservableProperties<TProps> {
        const eventHandlers: { [name: string]: Function } = {};
        keys(this.$listeners).forEach(name => {
          const normalizedName = `on${name.replace(/^on/g, '').replace(/^(.)/, v => v.toUpperCase())}`;
          let handler = this.$listeners[name];
          handler = Array.isArray(handler) ? () => {
            const args = arguments;
            (handler as Function[]).forEach(h => h(...args));
          } : handler;
          eventHandlers[normalizedName] = handler;
        });

        return {
          ...this.$attrs,
          ...this.$props,
          ...eventHandlers as any,
        };
      }

      // TODO: cache this?
      get componentArgs(): StatefulComponentArgs<TState, TProps> {
        return {
          ...this.state,
          ...this.props,
          ...this.resolvedObservableProps,

          setState: update => {
            this.state = update(this.state);
            this.$forceUpdate();
          },

          patchState: update => {
            this.state = { ...this.state, ...update(this.state) };
            this.$forceUpdate();
          },
        };
      }

      created() {
        this.state = initialState;
        this.resolvedObservableProps = {} as ResolvedObservableProperties<ObservableProperties<TProps>>;

        this.subscriptions = keys(observableProps).map(key => {
          const obs = observableProps[key] as unknown as Observable<ResolvedObservableProperties<ObservableProperties<TProps>>[typeof key]>;
          return obs.subscribe(value => {
            this.resolvedObservableProps[key] = value;
            this.$forceUpdate();
          });
        });

        lifecycleHooks.created && lifecycleHooks.created(this.componentArgs);
      }

      mounted() {
        lifecycleHooks.mounted && lifecycleHooks.mounted(this.componentArgs, this.$el as HTMLElement);
      }

      destroyed() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
      }

      render(h: CreateElement) {
        const w = window as any;
        createElementFuncs.push(w.h);
        w.h = createElement(h);
        const res = render(this.componentArgs);
        w.h = createElementFuncs.pop();

        return res;
      }
    }
  );
}

export function createElement(h: CreateElement): CreateElement {
  return (
    tag?: string | Component<any, any, any, any> | AsyncComponent<any, any, any, any> | (() => Component),
    childrenOrData?: VNodeData | VNodeChildren,
    children?: VNodeChildren,
  ): VNode => {
    if (!isPureComponentRenderFunction(tag) || !isPureComponentDataArg(childrenOrData)) {
      return h(tag, childrenOrData as any, children);
    }

    const render = tag as ((props: unknown) => JSX.Element);
    const args = childrenOrData;
    const on = args.on || {};
    const eventHandlers: { [name: string]: Function } = {};
    keys(on).forEach(name => {
      const normalizedName = `on${name.replace(/^on/g, '').replace(/^(.)/, v => v.toUpperCase())}`;
      let handler = on[name];
      handler = Array.isArray(handler) ? () => {
        const args = arguments;
        (handler as Function[]).forEach(h => h(...args));
      } : handler;
      eventHandlers[normalizedName] = handler;
    });

    const props = { ...args.attrs, ...eventHandlers, children } as any;

    return render(props);

    function isPureComponentRenderFunction(arg: any): arg is ((props: unknown) => JSX.Element) {
      return (arg instanceof Function) && !arg.cid;
    }

    function isPureComponentDataArg(arg: any): arg is ({ attrs: { [key: string]: any }; on?: { [key: string]: Function | Function[] } }) {
      return Object.prototype.hasOwnProperty.call(arg, 'attrs');
    }
  };
}
