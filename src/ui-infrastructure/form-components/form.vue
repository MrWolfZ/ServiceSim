<script lang="tsx">
import { Action, FormGroupState, MarkAsSubmittedAction } from 'pure-forms';
import { Component, Prop } from 'vue-property-decorator';
import { Emit } from '../decorators';
import { TsxComponent } from '../tsx-component';

export interface FormProps {
  formState: FormGroupState<any>;
  onAction: (action: Action) => any;
}

@Component({})
export class Form extends TsxComponent<FormProps> implements FormProps {
  @Prop() formState: FormGroupState<any>;

  @Emit()
  onAction(_: Action) { }

  private onSubmit(e: Event) {
    e.preventDefault();
    this.onAction(new MarkAsSubmittedAction(this.formState.id));
  }

  render() {
    return (
      <form novalidate='novalidate' onSubmit={(e: Event) => this.onSubmit(e)}>
        {this.$slots.default}
      </form>
    );
  }
}

export default Form;
</script>

<style scoped lang="scss">
</style>
