import { Action, FormControlState, FormControlValueTypes, isBoxed, MarkAsDirtyAction, MarkAsTouchedAction, SetValueAction } from 'pure-forms';
import './radio-input.scss';

export interface RadioInputProps {
  options: { [key: string]: { label?: string; value: FormControlValueTypes } | FormControlValueTypes };
  controlState: FormControlState<FormControlValueTypes>;
  onAction: (action: Action) => any;
}

// TODO: focus handling
export const RadioInput = ({ options, controlState, onAction }: RadioInputProps) => {
  return (
    <div style={{ paddingTop: '0.45rem', paddingBottom: '0.45rem' }}>
      {
        Object.keys(options).map(key => [
          (
            <input
              key={`${key}.input`}
              id={`${controlState.id}.${key}`}
              class='is-checkradio is-rtl is-white'
              type='radio'
              value={key}
              checked={controlState.value === getValue(key)}
              onInput={() => onInput(key)}
              onBlur={onBlur}
              disabled={controlState.isDisabled}
            />
          ),
          (
            <label key={`${key}.label`} for={`${controlState.id}.${key}`}>
              {getLabel(key)}
            </label>
          ),
        ]).reduce((agg, arr) => [...agg, ...arr], [])
      }
    </div>
  );

  function getLabel(key: string) {
    const optionsLabel = (options[key] as Exclude<RadioInputProps['options'][string], FormControlValueTypes>)!.label;
    return options[key] && optionsLabel !== undefined ? optionsLabel : key;
  }

  function getValue(key: string) {
    const optionsValue = (options[key] as Exclude<RadioInputProps['options'][string], FormControlValueTypes>)!.value;
    return !isBoxed(options[key]) && optionsValue !== undefined ? optionsValue : options[key];
  }

  function onInput(key: string) {
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
};
