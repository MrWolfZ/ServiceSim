<script lang="tsx">
import { Action, FormControlState, FormControlValueTypes, SetValueAction } from 'pure-forms';
import { Component, Prop } from 'vue-property-decorator';
import { Emit } from '../decorators';
import { TsxComponent } from '../tsx-component';

export interface FormInputProps<T extends FormControlValueTypes = string> {
  type?: 'text' | 'number' | 'checkbox' | 'radio';
  placeholder?: string;
  controlState: FormControlState<T>;
  onAction: (action: Action) => any;
}

@Component({
  components: {},
})
export class FormInput<T extends FormControlValueTypes = string> extends TsxComponent<FormInputProps<T>> implements FormInputProps<T> {
  @Prop() type: 'text' | 'number' | 'checkbox' | 'radio' | undefined;
  @Prop() placeholder: string | undefined;
  @Prop() controlState: FormControlState<T>;

  @Emit()
  onAction(_: Action) { }

  parseValue(el: HTMLInputElement) {
    return el.value as T;
  }

  render() {
    return (
      <input
        type={this.type}
        placeholder={this.placeholder}
        value={this.controlState.value}
        checked={this.controlState.value === true}
        onInput={(e: Event) => this.onAction(new SetValueAction(this.controlState.id, this.parseValue(e.target as HTMLInputElement)))}
      />
    );
  }
}

@Component({
  components: {},
})
export class BooleanFormInput extends FormInput<boolean> {
  parseValue(el: HTMLInputElement) {
    return el.value === 'true';
  }
}

@Component({
  components: {},
})
export class NumberFormInput extends FormInput<number> {
  parseValue(el: HTMLInputElement) {
    return parseInt(el.value, 10);
  }
}

export default FormInput;
</script>

<style scoped lang="scss">
</style>
