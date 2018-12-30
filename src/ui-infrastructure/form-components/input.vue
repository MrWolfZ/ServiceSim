<script lang="tsx">
import { Component, Emit, Prop } from 'vue-property-decorator';
import { TsxComponent } from '../tsx-component';

export interface InputProps<T> {
  type?: 'text' | 'number' | 'checkbox' | 'radio';
  placeholder?: string;
  value: T;
  checked?: boolean;
  onInput: (value: T) => any;
}

@Component({
  components: {},
})
export class Input<T extends string | number | boolean = string> extends TsxComponent<InputProps<T>> implements InputProps<T> {
  @Prop() type: 'text' | 'number' | 'checkbox' | 'radio' | undefined;
  @Prop() placeholder: string | undefined;
  @Prop() value: T;
  @Prop() checked: boolean | undefined;

  @Emit()
  onInput(_: T) { }

  parseValue(el: HTMLInputElement) {
    return el.value as T;
  }

  render() {
    return (
      <input
        type={this.type}
        placeholder={this.placeholder}
        value={this.value}
        checked={this.checked}
        onInput={(e: Event) => this.onInput(this.parseValue(e.target as HTMLInputElement))}
      />
    );
  }
}

@Component({
  components: {},
})
export class BooleanInput extends Input<boolean> {
  parseValue(el: HTMLInputElement) {
    return el.value === 'true';
  }
}

@Component({
  components: {},
})
export class NumberInput extends Input<number> {
  parseValue(el: HTMLInputElement) {
    return parseInt(el.value, 10);
  }
}

export default Input;
</script>

<style scoped lang="scss">
</style>
