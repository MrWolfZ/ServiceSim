import { keys } from 'src/util/util';
import { CreateElement, VNode, VNodeChildren, VNodeData } from 'vue';
import { Component as ComponentDecorator } from 'vue-property-decorator';
import VueRouter, { Route } from 'vue-router';
import { AsyncComponent, Component, RecordPropsDefinition } from 'vue/types/options';
import { TsxComponent } from './tsx-component';

export interface Props {
  children?: VNodeChildren;
}

const createElementFuncs: (CreateElement | undefined)[] = [];

export interface StatefulComponentContext {
  route: Route;
  router: VueRouter;
  element: Element;
  slots: {
    [name: string]: VNode[] | undefined;
  };
}

export interface LifecycleHooks<TState, TProps> {
  created?(state: TState, props: TProps, context: StatefulComponentContext): void;
  mounted?(state: TState, props: TProps, context: StatefulComponentContext): void;
  beforeRouteUpdate?(state: TState, to: Route, from: Route, next: () => void, context: StatefulComponentContext): void;
}

// partly inspired by https://codeburst.io/save-the-zombies-how-to-add-state-and-lifecycle-methods-to-stateless-react-components-1a996513866d
export function stateful<TState, TProps = {}>(
  render: (state: TState, props: TProps, context: StatefulComponentContext) => JSX.Element,
  initialState: TState,
  propsDef: RecordPropsDefinition<TProps>,
  lifecycleHooks: LifecycleHooks<TState, TProps> = {},
) {
  const name = (render.name || 'StatefulComponent').replace(/Def$/g, '');
  return ComponentDecorator({ props: propsDef })(
    class extends TsxComponent<TProps> {
      private state: TState = { ...initialState };

      getContext(): StatefulComponentContext {
        return {
          slots: this.$slots,
          route: this.$route,
          router: this.$router,
          element: this.$el,
        };
      }

      // @ts-ignore
      static get name() {
        return name;
      }

      // TODO: cache this?
      get props(): TProps {
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
          ...this.$props,
          ...eventHandlers as any,
        };
      }

      created() {
        lifecycleHooks.created && lifecycleHooks.created(this.state, this.props, this.getContext());
      }

      mounted() {
        lifecycleHooks.mounted && lifecycleHooks.mounted(this.state, this.props, this.getContext());
      }

      beforeRouteUpdate(to: Route, from: Route, next: () => void) {
        lifecycleHooks.beforeRouteUpdate && lifecycleHooks.beforeRouteUpdate(this.state, to, from, next, this.getContext());
      }

      render(h: CreateElement) {
        const w = window as any;
        createElementFuncs.push(w.h);
        w.h = createElement(h);
        const res = render(this.state, this.props, this.getContext());
        w.h = createElementFuncs.pop();

        return res;
      }
    }
  );
}

export function page<TState>(
  render: (state: TState, context: StatefulComponentContext) => JSX.Element,
  initialState: TState,
  lifecycleHooks: LifecycleHooks<TState, {}> = {},
) {
  return stateful((s, _, context) => render(s, context), initialState, {}, lifecycleHooks);
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
