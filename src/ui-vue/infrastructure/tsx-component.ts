import Vue from 'vue';

export default abstract class TsxComponent<P> extends Vue {
  vueTsxProps: Readonly<{ ref?: string; id?: string; class?: string }> & Readonly<P>;
}

declare global {
  namespace JSX {
    interface ElementAttributesProperty { vueTsxProps: {}; }
  }
}
