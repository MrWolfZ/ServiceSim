<script lang="tsx">
import { Action, FormControlState } from 'pure-forms';
import ReactDom from 'react-dom';
import { Component, Prop } from 'vue-property-decorator';
import { Emit } from '../decorators';
import { TsxComponent } from '../tsx-component';
import { TextInputReact } from './text-input-react';

export interface TextInputProps {
  placeholder?: string;
  rows?: number;
  controlState: FormControlState<string>;
  onAction: (action: Action) => any;
}

@Component({})
export class TextInput extends TsxComponent<TextInputProps> implements TextInputProps {
  @Prop() placeholder: string | undefined;
  @Prop() rows: number | undefined;
  @Prop() controlState: FormControlState<string>;

  @Emit()
  onAction(_: Action) { }

  render() {
    return <div />;
  }

  mounted() {
    ReactDom.render(
      <TextInputReact
        placeholder={this.placeholder}
        rows={this.rows}
        controlState={this.controlState}
        onAction={a => this.onAction(a)}
      />,
      this.$el,
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
