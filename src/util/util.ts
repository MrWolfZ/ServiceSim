export function keys<T>(t: T): (keyof T)[] {
  return Object.keys(t) as (keyof T)[];
}

export function copyProps<T>(target: T, props: Partial<T>) {
  keys(props).filter(key => Object.prototype.hasOwnProperty.call(target, key)).forEach(key => target[key] = props[key]!);
}

export function omit<T extends { [key: string]: any }, TKeys extends keyof T>(
  source: T,
  ...keysToOmit: TKeys[]
): Omit<T, TKeys> {
  return keys(source)
    .filter(key => !(keysToOmit as (keyof T)[]).includes(key))
    .reduce((agg, key) => ({ ...agg, [key]: source[key] }), {} as any);
}
