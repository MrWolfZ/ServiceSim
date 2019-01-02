<script lang="tsx">
import { Action, FormControlState, MarkAsDirtyAction, MarkAsTouchedAction, SetValueAction } from 'pure-forms';
import { Component, Prop } from 'vue-property-decorator';
import { Emit } from '../decorators';
import { TsxComponent } from '../tsx-component';

export interface TextInputProps {
  placeholder?: string;
  rows?: number;
  controlState: FormControlState<string>;
  onAction: (action: Action) => any;
}

// TODO: focus handling
@Component({})
export class TextInput extends TsxComponent<TextInputProps> implements TextInputProps {
  @Prop() placeholder: string | undefined;
  @Prop() rows: number | undefined;
  @Prop() controlState: FormControlState<string>;

  @Emit()
  onAction(_: Action) { }

  private onInput(e: Event) {
    const value = (e.target as HTMLInputElement | HTMLTextAreaElement).value;
    this.onAction(new SetValueAction(this.controlState.id, value));

    if (this.controlState.isPristine) {
      this.onAction(new MarkAsDirtyAction(this.controlState.id));
    }
  }

  private onBlur() {
    if (this.controlState.isUntouched) {
      this.onAction(new MarkAsTouchedAction(this.controlState.id));
    }
  }

  render() {
    if (this.rows && this.rows > 1) {
      return (
        <textarea
          class='textarea'
          rows={this.rows}
          placeholder={this.placeholder}
          value={this.controlState.value}
          onInput={(e: Event) => this.onInput(e)}
          onBlur={() => this.onBlur()}
          disabled={this.controlState.isDisabled}
        />
      );
    }

    return (
      <input
        class='input'
        type='text'
        placeholder={this.placeholder}
        value={this.controlState.value}
        onInput={(e: Event) => this.onInput(e)}
        onBlur={() => this.onBlur()}
        disabled={this.controlState.isDisabled}
      />
    );
  }
}

export default TextInput;
</script>

<style lang="scss">
.input,
.textarea {
  border: 0;
}

.textarea.code {
  font-family: 'Inconsolata', 'Consolas', 'Monaco', monospace;
}
</style>
