import { Action, FormControlState, MarkAsDirtyAction, MarkAsTouchedAction, SetValueAction } from 'pure-forms';
import { pure } from '../tsx';

export interface NumberInputProps {
  placeholder?: string;
  controlState: FormControlState<number>;
  onAction: (action: Action) => any;
}

// TODO: focus handling
const NumberInputDef = ({ placeholder, controlState, onAction }: NumberInputProps) => {
  return (
    <input
      class='input'
      type='number'
      placeholder={placeholder}
      value={controlState.value}
      onInput={onInput}
      onBlur={onBlur}
      disabled={controlState.isDisabled}
    />
  );

  function onInput(e: Event) {
    const value = (e.target as HTMLInputElement | HTMLTextAreaElement).value;
    onAction(new SetValueAction(controlState.id, parseInt(value, 10)));

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

export const NumberInput = pure(NumberInputDef);
