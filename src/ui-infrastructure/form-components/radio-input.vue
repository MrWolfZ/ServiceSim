<script lang="tsx">
import { Action, FormControlState, FormControlValueTypes, isBoxed, MarkAsDirtyAction, MarkAsTouchedAction, SetValueAction } from 'pure-forms';
import { Component, Prop } from 'vue-property-decorator';
import { Emit } from '../decorators';
import { TsxComponent } from '../tsx-component';

export interface RadioInputProps {
  options: { [key: string]: { label?: string; value: FormControlValueTypes } | FormControlValueTypes };
  controlState: FormControlState<FormControlValueTypes>;
  onAction: (action: Action) => any;
}

// TODO: focus handling
@Component({})
export class RadioInput extends TsxComponent<RadioInputProps> implements RadioInputProps {
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

  private onInput(key: string) {
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
      <div class='radio-input'>
        {
          Object.keys(this.options).map(key => [
            (
              <input
                key={`${key}.input`}
                id={`${this.controlState.id}.${key}`}
                class='is-checkradio is-rtl is-white'
                type='radio'
                value={key}
                checked={this.controlState.value === this.getValue(key)}
                onInput={() => this.onInput(key)}
                onBlur={() => this.onBlur()}
                disabled={this.controlState.isDisabled}
              />
            ),
            (
              <label key={`${key}.label`} for={`${this.controlState.id}.${key}`}>
                {this.getLabel(key)}
              </label>
            ),
          ]).reduce((agg, arr) => [...agg, ...arr], [])
        }
      </div>
    );
  }
}

export default RadioInput;
</script>

<style lang="scss">
.radio-input {
  padding-top: 0.45rem;
  padding-bottom: 0.45rem;
}

// override normal sized radio control size
// to ensure the dot is properly centered
.is-checkradio[type='radio'] {
  + label::before,
  + label:before,
  + label::after,
  + label:after {
    width: 24px;
    height: 24px;
  }
}
</style>
