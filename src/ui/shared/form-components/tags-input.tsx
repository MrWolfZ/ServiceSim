import Tagify from 'bulma-tagsinput';
import { Action, box, Boxed, FocusAction, FormControlState, MarkAsDirtyAction, MarkAsTouchedAction, SetValueAction, unbox, UnfocusAction } from 'pure-forms';
import { stateful } from 'src/ui/infrastructure/stateful-component';
import './tags-input.scss';

export interface TagsInputProps {
  placeholder?: string;
  controlState: FormControlState<Boxed<string[]>>;
  styleOverride?: unknown;
  onAction: (action: Action) => unknown;
}

export interface TagsInputState {
  tagsInstance: Tagify | undefined;
}

const initialState: TagsInputState = {
  tagsInstance: undefined,
};

export const TagsInput = stateful<TagsInputState, TagsInputProps>(
  initialState,
  {},
  function TagsInput({ tagsInstance, placeholder, controlState, styleOverride, onAction }) {
    const style = { ...styleOverride, border: 0 };

    updateTagsInstanceFromControlState(controlState);

    return (
      <input
        id={controlState.id}
        class='input'
        style={style}
        type='tags'
        placeholder={placeholder}
        onChange={onChange}
      />
    );

    function onChange(e: Event) {
      const value = (e.target as HTMLInputElement).value;

      if (value === unbox(controlState.value).join(',')) {
        return;
      }

      onAction(new SetValueAction(controlState.id, box(value.split(',').map(t => t.trim()).filter(t => !!t))));

      if (controlState.isPristine) {
        onAction(new MarkAsDirtyAction(controlState.id));
      }
    }

    function updateTagsInstanceFromControlState(newState: FormControlState<Boxed<string[]>>) {
      if (!tagsInstance) {
        return;
      }

      if (newState.isEnabled) {
        tagsInstance.enable();
      }

      if (newState.isDisabled) {
        // TODO: fix value getting reset
        tagsInstance.disable();
      }

      if (tagsInstance.getValue() === unbox(newState.value).join(',')) {
        return;
      }

      // we need to manually reset the HTML since (as of version 2.0.0) the source
      // implementation is bugged (tries to remove non-direct child which throws)
      tagsInstance.reset();
      tagsInstance.container.querySelectorAll('.control').forEach(e => {
        tagsInstance!.container.removeChild(e);
      });

      tagsInstance.setValue(unbox(newState.value));
      tagsInstance.select();
    }
  },
  {
    mounted({ controlState, onAction, setState }, element) {
      const tagsInstance = new Tagify(element);
      setState(s => ({ ...s, tagsInstance }));
      const tagInput = tagsInstance.container.querySelector('input')!;
      tagInput.addEventListener('blur', () => {
        onBlur();
        tagsInstance!.select();

        if (controlState.isFocused) {
          onAction(new UnfocusAction(controlState.id));
        }
      });

      tagInput.addEventListener('focus', () => {
        if (controlState.isUnfocused) {
          onAction(new FocusAction(controlState.id));
        }
      });

      function onBlur() {
        if (controlState.isUntouched) {
          onAction(new MarkAsTouchedAction(controlState.id));
        }
      }
    },
  },
);
