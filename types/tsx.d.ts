import Vue, { VNode } from 'vue';

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode { }
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue { }
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    vueTsxProps: Readonly<{ ref?: string; id?: string; class?: string; key?: any }>;
    context: any;
    setState: any;
    forceUpdate: any;
    props: any;
    state: any;
    refs: any;
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    ref?: string;
    id?: string;
    class?: string;
    key?: any;
  }
}
