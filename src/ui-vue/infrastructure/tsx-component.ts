import Vue from 'vue';

export default abstract class TsxComponent<P> extends Vue {
  vueTsxProps: Readonly<{ ref?: string }> & Readonly<P>;
}

declare global {
  namespace JSX {
    interface ElementAttributesProperty { vueTsxProps: {}; }
  }
}
