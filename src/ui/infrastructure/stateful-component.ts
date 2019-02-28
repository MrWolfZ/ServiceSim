import { Observable, Subscription } from 'rxjs';
import { isEmpty, keys } from 'src/util/util';
import { CreateElement, VueConstructor } from 'vue';
import { Component as ComponentDecorator } from 'vue-property-decorator';
import { createElement } from './create-element';
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
      private state: TState = initialState;
      private allObservablePropsHaveEmitted = false;
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

        const observablePropsThatHaveNotEmittedYet = keys(observableProps).reduce(
          (acc, name) => ({ ...acc, [name]: 0 }),
          {} as Dictionary<number>,
        );

        this.subscriptions = keys(observableProps).map(name => {
          const obs = observableProps[name] as unknown as Observable<ResolvedObservableProperties<ObservableProperties<TProps>>[typeof name]>;
          return obs.subscribe(value => {
            this.resolvedObservableProps[name] = value;
            delete observablePropsThatHaveNotEmittedYet[name as string];
            this.allObservablePropsHaveEmitted = isEmpty(observablePropsThatHaveNotEmittedYet);
            this.$forceUpdate();
          });
        });

        this.allObservablePropsHaveEmitted = isEmpty(observablePropsThatHaveNotEmittedYet);

        lifecycleHooks.created && lifecycleHooks.created(this.componentArgs);
      }

      mounted() {
        lifecycleHooks.mounted && lifecycleHooks.mounted(this.componentArgs, this.$el as HTMLElement);
      }

      destroyed() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
      }

      render(h: CreateElement) {
        if (!this.allObservablePropsHaveEmitted) {
          return null;
        }

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
