import { Action, FormControlState, FormGroupState } from 'pure-forms';
import { Parameter } from 'src/domain/parameter';
import { Emit } from 'src/ui/infrastructure/decorators';
import { TsxComponent } from 'src/ui/infrastructure/tsx-component';
import { FormField } from 'src/ui/shared/form-components/form-field';
import { NumberInput } from 'src/ui/shared/form-components/number-input';
import { RadioInput } from 'src/ui/shared/form-components/radio-input';
import { TextInput } from 'src/ui/shared/form-components/text-input';
import { Component, Prop } from 'vue-property-decorator';

export interface PredicateNodeFormValue {
  name: string;
  description: string;
  evalFunctionBody: string;
  parameterValues: {
    [param: string]: string | boolean | number;
  };
}

export interface PredicateNodeFormProps {
  formState: FormGroupState<PredicateNodeFormValue>;
  parameters: Parameter[] | undefined;
  onAction: (action: Action) => any;
}

@Component({})
export class PredicateNodeForm extends TsxComponent<PredicateNodeFormProps> implements PredicateNodeFormProps {
  @Prop() formState: FormGroupState<PredicateNodeFormValue>;
  @Prop() parameters: Parameter[] | undefined;

  @Emit()
  onAction(_: Action) { }

  private get nodeIsCustom() {
    return !this.parameters;
  }

  private get parameterNames() {
    return this.parameters ? this.parameters.map(p => p.name) : [];
  }

  private getParameterValueType(name: string) {
    return this.parameters!.find(p => p.name === name)!.valueType;
  }

  private getParameterDescription(name: string) {
    return this.parameters!.find(p => p.name === name)!.description;
  }

  private getParameterControlState(name: string) {
    // TODO: fix pure-forms type inference
    return this.formState.controls.parameterValues.controls[name] as any as FormControlState<any>;
  }

  render() {
    const onAction = (a: Action) => this.onAction(a);

    return (
      <div>

        <FormField
          controlState={this.formState.controls.name}
          errorMessages={{ required: 'Please enter a name' }}
        >
          <TextInput
            placeholder='Name'
            styleOverride={{ fontSize: '120%', fontWeight: 'bold' }}
            controlState={this.formState.controls.name}
            onAction={onAction}
          />
        </FormField>

        <FormField
          controlState={this.formState.controls.description}
          errorMessages={{ required: 'Please enter a description' }}
        >
          <TextInput
            rows={3}
            placeholder='Description'
            controlState={this.formState.controls.description}
            onAction={onAction}
          />
        </FormField>

        {this.nodeIsCustom &&
          <FormField
            label='Function Body'
            controlState={this.formState.controls.evalFunctionBody}
            errorMessages={{ required: 'Please enter a function body' }}
          >
            <TextInput
              className='code'
              rows={5}
              controlState={this.formState.controls.evalFunctionBody}
              onAction={onAction}
            />
          </FormField>
        }

        {!this.nodeIsCustom && this.parameterNames.length > 0 &&
          <div class='content'>

            <h5>Parameter Values</h5>

            {
              this.parameterNames.map(name =>
                <FormField
                  label={name}
                  tooltip={this.getParameterDescription(name)}
                  controlState={this.getParameterControlState(name)}
                  errorMessages={{ required: 'Please enter a value' }}
                >

                  {this.getParameterValueType(name) === 'string' &&
                    <TextInput
                      controlState={this.getParameterControlState(name)}
                      onAction={onAction}
                    />
                  }

                  {this.getParameterValueType(name) === 'number' &&
                    <NumberInput
                      controlState={this.getParameterControlState(name)}
                      onAction={onAction}
                    />
                  }

                  {this.getParameterValueType(name) === 'boolean' &&
                    <RadioInput
                      options={{ True: true, False: false }}
                      controlState={this.getParameterControlState(name)}
                      onAction={onAction}
                    />
                  }

                </FormField>
              )
            }

          </div>
        }

      </div>
    );
  }
}
