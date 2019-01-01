import { Emit as OrigEmit } from 'vue-property-decorator';

export function Emit(event?: string): MethodDecorator {
  return function (target: Object, key: string | symbol, descriptor: any) {
    if (typeof key === 'string') {
      key = key.replace(/^on/g, '');
    }

    return OrigEmit(event)(target, key, descriptor);
  };
}
