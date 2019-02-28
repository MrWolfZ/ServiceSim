export type Switchable = string | number | symbol;

export type ValueOfType<TSwitch, TKeyProp extends keyof TSwitch, TCase extends Switchable> = TSwitch extends { [key in TKeyProp]: TCase } ? TSwitch : never;

export type SwitchMap<TSwitch, TKeyProp extends keyof TSwitch, TKey extends Switchable, TReturn> = {
  [case$ in TKey]: TReturn | ((value: ValueOfType<TSwitch, TKeyProp, case$>) => TReturn);
};

export type ObjectSwitchMap<TSwitch, TKeyProp extends keyof TSwitch, TKey extends string> = {
  [case$ in TKey]: (value: ValueOfType<TSwitch, TKeyProp, case$>) => void;
};

export function switchObject<TSwitch extends { [prop: string]: any }, TKeyProp extends keyof TSwitch>(
  value: TSwitch,
  keyProp: TKeyProp,
  switchMap: ObjectSwitchMap<TSwitch, TKeyProp, TSwitch[TKeyProp]>,
) {
  const fn = switchMap[value[keyProp]];
  fn(value as ValueOfType<TSwitch, TKeyProp, TSwitch[TKeyProp]>);
}

export function switch$<TSwitch extends Switchable, TReturn = void>(value: TSwitch, switchMap: SwitchMap<TSwitch, any, TSwitch, TReturn>): TReturn {
  const res = switchMap[value];
  return res instanceof Function ? res(value) : res;
}
