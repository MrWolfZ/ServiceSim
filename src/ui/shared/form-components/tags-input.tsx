import Tagify from 'bulma-tagsinput';
import { Action, box, Boxed, FocusAction, FormControlState, MarkAsDirtyAction, MarkAsTouchedAction, SetValueAction, unbox, UnfocusAction } from 'pure-forms';
import { logger } from 'src/infrastructure/logging';
import { Emit } from 'src/ui/infrastructure/decorators';
import { TsxComponent } from 'src/ui/infrastructure/tsx-component';
import { Component, Prop, Watch } from 'vue-property-decorator';
import './tags-input.scss';

export interface TagsInputProps {
  placeholder?: string;
  rows?: number;
  controlState: FormControlState<Boxed<string[]>>;
  styleOverride?: any;
  onAction: (action: Action) => any;
}

@Component({})
export class TagsInput extends TsxComponent<TagsInputProps> implements TagsInputProps {
  @Prop() placeholder: string | undefined;
  @Prop() rows: number | undefined;
  @Prop() controlState: FormControlState<Boxed<string[]>>;
  @Prop() styleOverride: any;

  @Emit()
  onAction(_: Action) { }

  private tagsInstance: Tagify | undefined = undefined!;

  mounted() {
    this.tagsInstance = new Tagify(this.$el);
    const tagInput = this.tagsInstance.container.querySelector('input')!;
    tagInput.addEventListener('blur', () => {
      this.onBlur();
      this.tagsInstance!.select();

      if (this.controlState.isFocused) {
        this.onAction(new UnfocusAction(this.controlState.id));
      }
    });

    tagInput.addEventListener('focus', () => {
      if (this.controlState.isUnfocused) {
        this.onAction(new FocusAction(this.controlState.id));
      }
    });
  }

  @Watch('controlState')
  onControlStateChanged(newState: FormControlState<Boxed<string[]>>) {
    if (!this.tagsInstance) {
      logger.warn('control state changed while tags instance was not initialized!');
      return;
    }

    if (newState.isEnabled) {
      this.tagsInstance.enable();
    }

    if (newState.isDisabled) {
      // TODO: fix value getting reset
      this.tagsInstance.disable();
    }

    if (this.tagsInstance.getValue() === unbox(newState.value).join(',')) {
      return;
    }

    // we need to manually reset the HTML since (as of version 2.0.0) the source
    // implementation is bugged (tries to remove non-direct child which throws)
    this.tagsInstance.reset();
    this.tagsInstance.container.querySelectorAll('.control').forEach(e => {
      this.tagsInstance!.container.removeChild(e);
    });

    this.tagsInstance.setValue(unbox(newState.value));
    this.tagsInstance.select();
  }

  render() {
    const style = { ...this.styleOverride, border: 0 };
    const { placeholder, controlState, onAction } = this;

    // tslint:disable-next-line:no-floating-promises
    Promise.resolve().then(() => this.onControlStateChanged(controlState));

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
  }

  private onBlur() {
    if (this.controlState.isUntouched) {
      this.onAction(new MarkAsTouchedAction(this.controlState.id));
    }
  }
}
