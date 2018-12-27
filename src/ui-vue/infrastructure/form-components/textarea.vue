<script lang="tsx">
import { Component, Emit, Prop } from 'vue-property-decorator';
import TsxComponent from '../tsx-component';

export interface TextAreaProps {
  rows?: number;
  placeholder?: string;
  value?: string;
  onInput?: (value: string) => any;
}

@Component({
  components: {},
})
export default class TextArea extends TsxComponent<TextAreaProps> implements TextAreaProps {
  @Prop() rows: number | undefined;
  @Prop() placeholder: string | undefined;
  @Prop() value: string | undefined;

  @Emit('input')
  onInput(value: string) {
    return value;
  }

  render() {
    return (
      <textarea rows={this.rows}
             placeholder={this.placeholder}
             value={this.value}
             onInput={(e: Event) => this.onInput((e.target as HTMLTextAreaElement).value)}>
      </textarea>
    );
  }
}
</script>

<style scoped lang="scss">
</style>
