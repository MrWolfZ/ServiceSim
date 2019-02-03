import { keys } from 'src/util/util';
import { ComponentOptions, CreateElement, FunctionalComponentOptions, RenderContext } from 'vue';
import { Component } from 'vue-property-decorator';
import VueRouter, { Route } from 'vue-router';
import { TsxComponent } from './tsx-component';

export interface PureComponentContext {
  slots: {
    [name: string]: any;
  };
}

// partly inspired by https://codeburst.io/save-the-zombies-how-to-add-state-and-lifecycle-methods-to-stateless-react-components-1a996513866d
export function pure<TProps = {}>(def: (props: TProps, context: PureComponentContext) => JSX.Element) {
  const name = (def.name || 'PureComponent').replace(/Def$/g, '');
  return Component({ functional: true } as any as ComponentOptions<TsxComponent<TProps>>)(
    class extends TsxComponent<TProps> {
      // @ts-ignore
      static get name() {
        return name;
      }

      render(h: CreateElement, context: RenderContext<TProps>) {
        // babel plugin will transpile method to function component definition
        const options = def as any as FunctionalComponentOptions<TProps>;

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

        const render = options.render!.bind(undefined) as any as (h: CreateElement, props: TProps, context: PureComponentContext) => JSX.Element;
        const props = { ...context.props, ...eventHandlers } as any;
        const renderContext: PureComponentContext = {
          slots: context.slots(),
        };

        return render(h, props, renderContext);
      }
    }
  );
}

export interface StatefulComponentContext extends PureComponentContext {
  route: Route;
  router: VueRouter;
}

export interface LifecycleHooks<TState> {
  created?(state: TState, context: StatefulComponentContext): void;
  mounted?(state: TState, context: StatefulComponentContext): void;
  beforeRouteUpdate?(state: TState, to: Route, from: Route, next: () => void, context: StatefulComponentContext): void;
}

export function stateful<TState, TProps = {}>(
  def: (state: TState, props: TProps, context: StatefulComponentContext) => JSX.Element,
  initialState: TState,
  lifecycleHooks: LifecycleHooks<TState> = {},
) {
  const name = (def.name || 'StatefulComponent').replace(/Def$/g, '');
  return Component({})(
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

      created() {
        lifecycleHooks.created && lifecycleHooks.created(this.state, this.context);
      }

      mounted() {
        lifecycleHooks.mounted && lifecycleHooks.mounted(this.state, this.context);
      }

      beforeRouteUpdate(to: Route, from: Route, next: () => void) {
        lifecycleHooks.beforeRouteUpdate && lifecycleHooks.beforeRouteUpdate(this.state, to, from, next, this.context);
      }

      render(h: CreateElement) {
        // babel plugin will transpile method to function component definition
        const options = def as any as FunctionalComponentOptions<TProps>;

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

        const render = options.render!.bind(undefined) as any as (...args: any[]) => JSX.Element;

        const props = { ...this.$props, ...eventHandlers } as any;

        return render.length === 4 ? render(h, this.state, props, this.context) : render(h, this.state, this.context);
      }
    }
  );
}

export function page<TState>(
  def: (state: TState, context: StatefulComponentContext) => JSX.Element,
  initialState: TState,
  lifecycleHooks: LifecycleHooks<TState> = {},
) {
  return stateful(def, initialState, lifecycleHooks);
}
