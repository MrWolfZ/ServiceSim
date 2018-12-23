import Vue from 'vue';

export default abstract class TsxComponent<P> extends Vue {
  vueTsxProps: Readonly<{}> & Readonly<P>;
}

declare global {
    namespace JSX {
        interface ElementAttributesProperty { vueTsxProps: {}; }
    }
}
