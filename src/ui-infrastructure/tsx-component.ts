import Vue from 'vue';

export abstract class TsxComponent<P> extends Vue {
  vueTsxProps: Readonly<{ ref?: string; id?: string; class?: string; key?: any }> & Readonly<P>;
}

declare global {
  namespace JSX {
    interface ElementAttributesProperty { vueTsxProps: {}; }
  }
}
