declare module 'bulma-tagsinput' {
  export interface Options {
    disabled?: boolean;
    delimiter?: string;
    allowDelete?: boolean;
    lowercase?: boolean;
    uppercase?: boolean;
    duplicates?: boolean;
  }

  export default class Tagify {
    constructor(element: Element, options: Options = {});

    container: Element;
    tags: string[];

    init();
    enable(): void;
    disable(): void;
    select(el?: Element): void;
    addTag(textOrArray: string | string[]): void;
    getValue(): string;
    setValue(textOrArray: string | string[]): void;
    setInputWidth(): void;
    savePartial(textOrArray: string | string[]): void;
    save(): void;
    caretAtStart(el: Element): void;
    refocus(e: Event): void;
    reset(): void;
    destroy(): void;
  }
}
