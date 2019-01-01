<script lang="tsx">
import { Action, FormControlState, FormControlValueTypes, isBoxed, MarkAsDirtyAction, MarkAsTouchedAction, SetValueAction } from 'pure-forms';
import { Component, Prop } from 'vue-property-decorator';
import { Emit } from '../decorators';
import { TsxComponent } from '../tsx-component';

export interface SelectProps {
  options: { [key: string]: { label?: string; value: FormControlValueTypes } | FormControlValueTypes };
  controlState: FormControlState<FormControlValueTypes>;
  onAction: (action: Action) => any;
}

// TODO: add support for multiple selection
// TODO: focus handling
@Component({})
export class Select extends TsxComponent<SelectProps> implements SelectProps {
  @Prop() options: { [key: string]: { label?: string; value: FormControlValueTypes } | FormControlValueTypes };
  @Prop() controlState: FormControlState<FormControlValueTypes>;

  @Emit()
  onAction(_: Action) { }

  private getLabel(key: string) {
    const optionsLabel = (this.options[key] as Exclude<this['options'][string], FormControlValueTypes>)!.label;
    return this.options[key] && optionsLabel !== undefined ? optionsLabel : key;
  }

  private getValue(key: string) {
    const optionsValue = (this.options[key] as Exclude<this['options'][string], FormControlValueTypes>)!.value;
    return !isBoxed(this.options[key]) && optionsValue !== undefined ? optionsValue : this.options[key];
  }

  private onChange(e: Event) {
    const key = (e.target as HTMLSelectElement).value;
    this.onAction(new SetValueAction(this.controlState.id, this.getValue(key)));

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
      <div class='select'>

        <select
          class='is-borderless'
          onChange={(e: Event) => this.onChange(e)}
          onBlur={() => this.onBlur()}
          disabled={this.controlState.isDisabled}
        >
          {
            Object.keys(this.options).map(key =>
              <option key={key} value={key}>{this.getLabel(key)}</option>
            )
          }
        </select>

      </div>
    );
  }
}

export default Select;
</script>

<style scoped lang="scss">
.select:not(.is-multiple) {
  height: 2.5em;
}
</style>
