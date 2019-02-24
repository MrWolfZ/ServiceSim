import { keys } from 'src/util/util';
import { ComponentOptions, CreateElement, RenderContext, VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import VueRouter, { Route } from 'vue-router';
import { RecordPropsDefinition } from 'vue/types/options';
import { TsxComponent } from './tsx-component';

export interface PureComponentContext {
  slots: {
    [name: string]: VNode[] | undefined;
  };
}

const pureCreateElementFuncs: (CreateElement | undefined)[] = [];

// partly inspired by https://codeburst.io/save-the-zombies-how-to-add-state-and-lifecycle-methods-to-stateless-react-components-1a996513866d
export function pure<TProps = {}>(render: (props: TProps, context: PureComponentContext) => JSX.Element) {
  const name = (render.name || 'PureComponent').replace(/Def$/g, '');
  return Component({ functional: true } as any as ComponentOptions<TsxComponent<TProps>>)(
    class extends TsxComponent<TProps> {
      // @ts-ignore
      static get name() {
        return name;
      }

      render(h: CreateElement, context: RenderContext<TProps>) {
        const eventHandlers: { [name: string]: Function } = {};
        keys(context.listeners).forEach(name => {
          const normalizedName = `on${name.replace(/^on/g, '').replace(/^(.)/, v => v.toUpperCase())}`;
          let handler = context.listeners[name];
          handler = Array.isArray(handler) ? () => {
            const args = arguments;
            (handler as Function[]).forEach(h => h(...args));
          } : handler;
          eventHandlers[normalizedName] = handler;
        });

        const props = { ...context.props, ...eventHandlers } as any;
        const renderContext: PureComponentContext = {
          slots: context.slots(),
        };

        const w = window as any;
        pureCreateElementFuncs.push(w.h);
        w.h = h;
        const res = render(props, renderContext);
        w.h = pureCreateElementFuncs.pop();

        return res;
      }
    }
  );
}

export interface StatefulComponentContext extends PureComponentContext {
  route: Route;
  router: VueRouter;
}

export interface LifecycleHooks<TState, TProps> {
  created?(state: TState, props: TProps, context: StatefulComponentContext): void;
  mounted?(state: TState, props: TProps, context: StatefulComponentContext): void;
  beforeRouteUpdate?(state: TState, to: Route, from: Route, next: () => void, context: StatefulComponentContext): void;
}

const statefulCreateElementFuncs: (CreateElement | undefined)[] = [];

export function stateful<TState, TProps = {}>(
  render: (state: TState, props: TProps, context: StatefulComponentContext) => JSX.Element,
  initialState: TState,
  propsDef: RecordPropsDefinition<TProps>,
  lifecycleHooks: LifecycleHooks<TState, TProps> = {},
) {
  const name = (render.name || 'StatefulComponent').replace(/Def$/g, '');
  return Component({ props: propsDef })(
    class extends TsxComponent<TProps> {
      private state: TState = { ...initialState };

      get context(): StatefulComponentContext {
        return {
          slots: this.$slots,
          route: this.$route,
          router: this.$router,
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
        lifecycleHooks.created && lifecycleHooks.created(this.state, this.props, this.context);
      }

      mounted() {
        lifecycleHooks.mounted && lifecycleHooks.mounted(this.state, this.props, this.context);
      }

      beforeRouteUpdate(to: Route, from: Route, next: () => void) {
        lifecycleHooks.beforeRouteUpdate && lifecycleHooks.beforeRouteUpdate(this.state, to, from, next, this.context);
      }

      render(h: CreateElement) {
        const w = window as any;
        statefulCreateElementFuncs.push(w.h);
        w.h = h;
        const res = render(this.state, this.props, this.context);
        w.h = statefulCreateElementFuncs.pop();

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
