<script lang="tsx">
import { FormControlState } from 'pure-forms';
import { Component, Prop } from 'vue-property-decorator';
import { TsxComponent } from '../tsx-component';

export interface FormFieldProps {
  label?: string;
  controlState: FormControlState<string>;
  errorMessageFactory?: (errorName: string, errorValue: any) => string;
  errorMessages?: { [errorName: string]: string };
}

@Component({
  components: {},
})
export class FormField extends TsxComponent<FormFieldProps> implements FormFieldProps {
  @Prop() label: string | undefined;
  @Prop() controlState: FormControlState<string>;
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

  render() {
    return (
      <div class='field'>

        {this.label &&
          <label class='label'>
            {this.label}
          </label>
        }

        <div class='control'>
          {this.$slots.default}
          {
            this.errorNames.map(name =>
              <span key={name} class='help is-danger'>
                {this.getErrorMessage(name)}
              </span>
            )
          }
        </div>

      </div>
    );
  }
}

export default FormField;
</script>

<style scoped lang="scss">
</style>
