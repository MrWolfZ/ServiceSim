<script lang="tsx">
import { Action, FormControlState, MarkAsDirtyAction, MarkAsTouchedAction, SetValueAction } from 'pure-forms';
import { Component, Prop } from 'vue-property-decorator';
import { Emit } from '../decorators';
import { TsxComponent } from '../tsx-component';

export interface NumberInputProps {
  placeholder?: string;
  controlState: FormControlState<number>;
  onAction: (action: Action) => any;
}

// TODO: focus handling
@Component({})
export class NumberInput extends TsxComponent<NumberInputProps> implements NumberInputProps {
  @Prop() placeholder: string | undefined;
  @Prop() controlState: FormControlState<number>;

  @Emit()
  onAction(_: Action) { }

  private onInput(e: Event) {
    const value = (e.target as HTMLInputElement | HTMLTextAreaElement).value;
    this.onAction(new SetValueAction(this.controlState.id, parseInt(value, 10)));

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
    return (
      <input
        class='input'
        type='number'
        placeholder={this.placeholder}
        value={this.controlState.value}
        onInput={(e: Event) => this.onInput(e)}
        onBlur={() => this.onBlur()}
        disabled={this.controlState.isDisabled}
      />
    );
  }
}

export default NumberInput;
</script>

<style scoped lang="scss">
</style>
