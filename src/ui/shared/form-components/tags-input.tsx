import Tagify from 'bulma-tagsinput';
import { Action, box, Boxed, FocusAction, FormControlState, MarkAsDirtyAction, MarkAsTouchedAction, SetValueAction, unbox, UnfocusAction } from 'pure-forms';
import { logger } from 'src/infrastructure/logging';
import { stateful } from 'src/ui/infrastructure/tsx';
import { RecordPropsDefinition } from 'vue/types/options';
import './tags-input.scss';

export interface TagsInputProps {
  placeholder?: string;
  controlState: FormControlState<Boxed<string[]>>;
  styleOverride?: any;
  onAction: (action: Action) => any;
}

const propsDefinition: RecordPropsDefinition<TagsInputProps> = {
  placeholder: {},
  controlState: {},
  styleOverride: {},
  onAction: {},
};

export interface TagsInputState {
  tagsInstance: Tagify | undefined;
}

const initialState: TagsInputState = {
  tagsInstance: undefined,
};

export const TagsInput = stateful(
  function TagsInput(
    state: TagsInputState,
    { placeholder, controlState, styleOverride, onAction }: TagsInputProps,
  ) {
    const style = { ...styleOverride, border: 0 };

    // tslint:disable-next-line:no-floating-promises
    Promise.resolve().then(() => updateTagsInstanceFromControlState(controlState));

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
      if (!state.tagsInstance) {
        logger.warn('control state changed while tags instance was not initialized!');
        return;
      }

      if (newState.isEnabled) {
        state.tagsInstance.enable();
      }

      if (newState.isDisabled) {
        // TODO: fix value getting reset
        state.tagsInstance.disable();
      }

      if (state.tagsInstance.getValue() === unbox(newState.value).join(',')) {
        return;
      }

      // we need to manually reset the HTML since (as of version 2.0.0) the source
      // implementation is bugged (tries to remove non-direct child which throws)
      state.tagsInstance.reset();
      state.tagsInstance.container.querySelectorAll('.control').forEach(e => {
        state.tagsInstance!.container.removeChild(e);
      });

      state.tagsInstance.setValue(unbox(newState.value));
      state.tagsInstance.select();
    }
  },
  initialState,
  propsDefinition,
  {
    mounted(state, props, context) {
      state.tagsInstance = new Tagify(context.element);
      const tagInput = state.tagsInstance.container.querySelector('input')!;
      tagInput.addEventListener('blur', () => {
        onBlur();
        state.tagsInstance!.select();

        if (props.controlState.isFocused) {
          props.onAction(new UnfocusAction(props.controlState.id));
        }
      });

      tagInput.addEventListener('focus', () => {
        if (props.controlState.isUnfocused) {
          props.onAction(new FocusAction(props.controlState.id));
        }
      });

      function onBlur() {
        if (props.controlState.isUntouched) {
          props.onAction(new MarkAsTouchedAction(props.controlState.id));
        }
      }
    },
  },
);
