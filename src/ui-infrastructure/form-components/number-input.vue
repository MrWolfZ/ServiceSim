<script lang="tsx">
import { Action, FormControlState, SetValueAction } from 'pure-forms';
import { Component, Prop } from 'vue-property-decorator';
import { Emit } from '../decorators';
import { TsxComponent } from '../tsx-component';

export interface NumberInputProps {
  placeholder?: string;
  controlState: FormControlState<number>;
  onAction: (action: Action) => any;
}

@Component({
  components: {},
})
export class NumberInput extends TsxComponent<NumberInputProps> implements NumberInputProps {
  @Prop() placeholder: string | undefined;
  @Prop() controlState: FormControlState<number>;

  @Emit()
  onAction(_: Action) { }

  private onInput(e: Event) {
    const value = (e.target as HTMLInputElement | HTMLTextAreaElement).value;
    this.onAction(new SetValueAction(this.controlState.id, parseInt(value, 10)));
  }

  render() {
    return (
      <input
        class='input'
        type='number'
        placeholder={this.placeholder}
        value={this.controlState.value}
        onInput={(e: Event) => this.onInput(e)}
      />
    );
  }
}

export default NumberInput;
</script>

<style scoped lang="scss">
</style>
