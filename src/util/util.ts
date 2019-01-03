export function keys<T>(t: T): (keyof T)[] {
  return Object.keys(t) as (keyof T)[];
}

export function copyProps<T>(target: T, props: Partial<T>) {
  keys(props).filter(key => Object.prototype.hasOwnProperty.call(target, key)).forEach(key => target[key] = props[key]!);
}
