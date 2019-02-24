import { Action, FormControlState, FormControlValueTypes, isBoxed, MarkAsDirtyAction, MarkAsTouchedAction, SetValueAction } from 'pure-forms';
import { pure } from 'src/ui/infrastructure/tsx';

export interface SelectProps {
  options: { [key: string]: { label?: string; value: FormControlValueTypes } | FormControlValueTypes };
  isMultiple?: boolean;
  controlState: FormControlState<FormControlValueTypes>;
  onAction: (action: Action) => any;
}

// TODO: add support for multiple selection
// TODO: focus handling
export const Select = pure(({ options, isMultiple, controlState, onAction }: SelectProps) => {
  const style = {} as any;

  if (!isMultiple) {
    style.height = '2.5em';
  }

  return (
    <div class='select' style={style}>

      <select
        style={{ border: 0 }}
        onChange={onChange}
        onBlur={onBlur}
        disabled={controlState.isDisabled}
      >
        {
          Object.keys(options).map(key =>
            <option key={key} value={key}>{getLabel(key)}</option>
          )
        }
      </select>

    </div>
  );

  function getLabel(key: string) {
    const optionsLabel = (options[key] as Exclude<SelectProps['options'][string], FormControlValueTypes>)!.label;
    return options[key] && optionsLabel !== undefined ? optionsLabel : key;
  }

  function getValue(key: string) {
    const optionsValue = (options[key] as Exclude<SelectProps['options'][string], FormControlValueTypes>)!.value;
    return !isBoxed(options[key]) && optionsValue !== undefined ? optionsValue : options[key];
  }

  function onChange(e: Event) {
    const key = (e.target as HTMLSelectElement).value;
    onAction(new SetValueAction(controlState.id, getValue(key)));

    if (controlState.isPristine) {
      onAction(new MarkAsDirtyAction(controlState.id));
    }
  }

  function onBlur() {
    if (controlState.isUntouched) {
      onAction(new MarkAsTouchedAction(controlState.id));
    }
  }
});
