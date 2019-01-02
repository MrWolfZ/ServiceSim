// tslint:disable:no-invalid-this
export function Emit(event?: string): MethodDecorator {
  return function (_: Object, key: string | symbol, descriptor: any) {
    if (typeof key === 'string') {
      key = key.replace(/^on/g, '').replace(/^(.)/, v => v.toLowerCase());
    }

    const original = descriptor.value;
    descriptor.value = function emitter(...args: any[]) {
      const emit = (returnValue: any) => {
        if (returnValue !== undefined) { args.unshift(returnValue); }
        this.$emit(event || key, ...args);
      };

      const returnValue: any = original.apply(this, args);

      Promise.resolve(returnValue).then(emit);
    };
  };
}
