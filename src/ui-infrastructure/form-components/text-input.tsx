import { Action, FormControlState, MarkAsDirtyAction, MarkAsTouchedAction, SetValueAction } from 'pure-forms';
import { pure } from '../tsx';

export interface TextInputProps {
  placeholder?: string;
  rows?: number;
  controlState: FormControlState<string>;
  isCode?: boolean;
  onAction: (action: Action) => any;
}

// TODO: focus handling
const TextInputDef = ({ placeholder, rows, controlState, isCode, onAction }: TextInputProps) => {
  const style = { border: 0 } as any;

  if (isCode) {
    style.fontFamily = '\'Inconsolata\', \'Consolas\', \'Monaco\', monospace';
  }

  if (rows && rows > 1) {
    return (
      <textarea
        class='textarea'
        style={style}
        rows={rows}
        placeholder={placeholder}
        value={controlState.value}
        onInput={onInput}
        onBlur={onBlur}
        disabled={controlState.isDisabled}
      />
    );
  }

  return (
    <input
      class='input'
      style={style}
      type='text'
      placeholder={placeholder}
      value={controlState.value}
      onInput={onInput}
      onBlur={onBlur}
      disabled={controlState.isDisabled}
    />
  );

  function onInput(e: Event) {
    const value = (e.target as HTMLInputElement | HTMLTextAreaElement).value;
    onAction(new SetValueAction(controlState.id, value));

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

export const TextInput = pure(TextInputDef);