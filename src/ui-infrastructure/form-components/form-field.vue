<script lang="tsx">
import { FormControlState } from 'pure-forms';
import { Component, Prop } from 'vue-property-decorator';
import ExpansionContainer from '../expansion-container.vue';
import { TsxComponent } from '../tsx-component';

export interface FormFieldProps {
  label?: string;
  tooltip?: string;
  tooltipIcon?: string;
  controlState: FormControlState<any>;
  errorMessageFactory?: (errorName: string, errorValue: any) => string;
  errorMessages?: { [errorName: string]: string };
}

@Component({})
export class FormField extends TsxComponent<FormFieldProps> implements FormFieldProps {
  @Prop() label: string | undefined;
  @Prop() tooltip: string | undefined;
  @Prop() tooltipIcon: string | undefined;
  @Prop() controlState: FormControlState<any>;
  @Prop() errorMessageFactory: ((errorName: string, errorValue: any) => string) | undefined;
  @Prop() errorMessages?: { [errorName: string]: string };

  private get errorNames() {
    return Object.keys(this.controlState.errors);
  }

  private getErrorMessage(errorName: string) {
    let errorMessage = errorName;

    if (this.errorMessageFactory) {
      errorMessage = this.errorMessageFactory(name, this.controlState.errors[name]) || errorMessage;
    }

    if (this.errorMessages) {
      errorMessage = this.errorMessages[errorName] || errorMessage;
    }

    return errorMessage;
  }

  private get errorsAreShown() {
    return this.controlState.isInvalid && (this.controlState.isSubmitted || this.controlState.isTouched);
  }

  render() {
    return (
      <div class='field'>

        {this.label &&
          <label class='label'>
            {this.label}

            {this.tooltip &&
              <span class='tooltip is-tooltip-primary is-tooltip-right' data-tooltip={this.tooltip}>
                <fa-icon icon={this.tooltipIcon || 'info-circle'} />
              </span>
            }
          </label>
        }

        <div class='control'>
          {this.$slots.default}
          <ExpansionContainer isExpanded={this.errorsAreShown}>
            {
              this.errorNames.map(name =>
                <span key={name} class='help is-danger'>
                  {this.getErrorMessage(name)}
                </span>
              )
            }
          </ExpansionContainer>
        </div>

      </div>
    );
  }
}

export default FormField;
</script>

<style scoped lang="scss">
.tooltip {
  margin-left: 0.25rem;
}
</style>
