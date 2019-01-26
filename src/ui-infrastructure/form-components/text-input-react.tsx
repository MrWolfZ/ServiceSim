import { Action, FormControlState, MarkAsDirtyAction, MarkAsTouchedAction, SetValueAction } from 'pure-forms';
import { FormEvent } from 'react';
import css from 'styled-jsx/css';

export interface TextInputReactProps {
  placeholder?: string;
  rows?: number;
  controlState: FormControlState<string>;
  onAction: (action: Action) => any;
  class?: string;
}

// TODO: focus handling
export const TextInputReact = ({ rows, placeholder, controlState, onAction }: TextInputReactProps) => {

  function onInput(e: FormEvent) {
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

  if (rows && rows > 1) {
    return (
      <textarea
        className='textarea'
        rows={rows}
        placeholder={placeholder}
        value={controlState.value}
        onInput={onInput}
        onBlur={onBlur}
        disabled={controlState.isDisabled}
      >
        <style jsx={true}>{textareaStyle}</style>
      </textarea>
    );
  }

  return (
    <input
      className='input'
      type='text'
      placeholder={placeholder}
      value={controlState.value}
      onInput={onInput}
      onBlur={onBlur}
      disabled={controlState.isDisabled}
    >
      <style jsx={true}>{inputStyle}</style>
    </input>
  );
};

const textareaStyle = css`
.textarea {
  border: 0;
}

.textarea.code {
  font-family: 'Inconsolata', 'Consolas', 'Monaco', monospace;
}
`;

const inputStyle = css`
.input {
  border: 0;
}
`;
