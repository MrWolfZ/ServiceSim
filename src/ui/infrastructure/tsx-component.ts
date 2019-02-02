import Vue from 'vue';

export abstract class TsxComponent<P> extends Vue {
  vueTsxProps: Readonly<P> & Readonly<{ ref?: string; id?: string; class?: string; key?: any }>;
}

declare global {
  namespace JSX {
    interface ElementAttributesProperty { vueTsxProps: {}; }
  }
}
