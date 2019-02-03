import { Action, FormControlState, MarkAsDirtyAction, MarkAsTouchedAction, SetValueAction } from 'pure-forms';
import { pure } from 'src/ui/infrastructure/tsx';

export interface TextInputProps {
  placeholder?: string;
  rows?: number;
  controlState: FormControlState<string>;
  isCode?: boolean;
  styleOverride?: any;
  onAction: (action: Action) => any;
}

// TODO: focus handling
const TextInputDef = ({ placeholder, rows, controlState, isCode, onAction, styleOverride }: TextInputProps) => {
  const style = { ...styleOverride, border: 0 };

  if (isCode) {
    style.fontFamily = '\'Inconsolata\', \'Consolas\', \'Monaco\', monospace';
  }

  if (rows && rows > 1) {
    return (
      <textarea
        id={controlState.id}
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
      id={controlState.id}
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
