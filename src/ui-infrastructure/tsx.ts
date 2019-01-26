import { ComponentOptions, CreateElement, FunctionalComponentOptions, RenderContext } from 'Vue';
import { Component } from 'vue-property-decorator';
import { keys } from '../util';
import { TsxComponent } from './tsx-component';

// partly inspired by https://codeburst.io/save-the-zombies-how-to-add-state-and-lifecycle-methods-to-stateless-react-components-1a996513866d
export function pure<TProps>(def: (props: TProps, context: RenderContext<TProps>) => JSX.Element) {
  const name = (def.name || 'Component').replace(/Def$/g, '');
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

        const render = options.render!.bind(undefined) as any;
        const props = { ...context.props, ...eventHandlers } as any;
        return render(h, props, context);
      }
    }
  );
}
