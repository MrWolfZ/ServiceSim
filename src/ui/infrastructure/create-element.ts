import { keys } from 'src/util/util';
import { AsyncComponent, Component, CreateElement, VNode, VNodeChildren, VNodeData } from 'vue';

export function createElement(h: CreateElement): CreateElement {
  return (
    tag?: string | Component<any, any, any, any> | AsyncComponent<any, any, any, any> | (() => Component),
    childrenOrData?: VNodeData | VNodeChildren,
    children?: VNodeChildren,
  ): VNode => {
    if (!isPureComponentRenderFunction(tag)) {
      return h(tag, childrenOrData as any, children);
    }

    const render = tag as ((props: unknown) => JSX.Element);
    const args = isVNodeData(childrenOrData) ? childrenOrData : {};
    children = children || (!isVNodeData(childrenOrData) ? childrenOrData : undefined);
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

    function isVNodeData(arg: any): arg is VNodeData {
      return !!arg && Object.prototype.hasOwnProperty.call(arg, 'attrs');
    }
  };
}
