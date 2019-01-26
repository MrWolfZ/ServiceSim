import { ComponentOptions, CreateElement, FunctionalComponentOptions } from 'Vue';
import { Component } from 'vue-property-decorator';
import { keys } from '../util';
import { TsxComponent } from './tsx-component';

export function pure<TProps>(def: (props: TProps) => JSX.Element) {
  const name = def.name.replace(/Def$/g, '');
  return Component({ functional: true } as any as ComponentOptions<TsxComponent<TProps>>)(
    class extends TsxComponent<TProps> {
      private eventHandlers: { [name: string]: Function } = {};

      // @ts-ignore
      static get name() {
        return name;
      }

      created() {
        keys(this.$listeners).forEach(name => {
          const normalizedName = `on${name.replace(/^on/g, '').replace(/^(.)/, v => v.toUpperCase())}`;
          let handler = this.$listeners[name];
          handler = Array.isArray(handler) ? () => {
            const args = arguments;
            (handler as Function[]).forEach(h => h(...args));
          } : handler;
          this.eventHandlers[normalizedName] = handler;
        });
      }

      render(h: CreateElement) {
        // babel plugin will transpile method to function component definition
        const options = def as any as FunctionalComponentOptions<TProps>;
        const props = { ...this.$attrs, ...this.eventHandlers } as any;
        return options.render!.bind(undefined)(h, props);
      }
    }
  );
}
