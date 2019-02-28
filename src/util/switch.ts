export type Switchable = string | number | symbol;

export type SwitchMap<TSwitch extends Switchable, TReturn> = {
  [case$ in TSwitch]: TReturn | (() => TReturn);
};

export function switch$<TSwitch extends Switchable, TReturn = void>(value: TSwitch, switchMap: SwitchMap<TSwitch, TReturn>): TReturn {
  const res = switchMap[value];
  return res instanceof Function ? res() : res;
}
