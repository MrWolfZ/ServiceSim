import { Action, FormControlState, FormGroupState } from 'pure-forms';
import { Component, Prop } from 'vue-property-decorator';
import { Emit, FormField, NumberInput, RadioInput, TextInput, TsxComponent } from '../../ui-infrastructure';
import { Parameter } from '../parameter/parameter.types';
import { PredicateNodeFormValue } from './predicate-node.types';

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
            onAction={a => this.onAction(a)}
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
            onAction={a => this.onAction(a)}
          />
        </FormField>

        {this.nodeIsCustom &&
          <FormField
            label='Function Body'
            controlState={this.formState.controls.evalFunctionBody}
            errorMessages={{ required: 'Please enter a function body' }}
          >
            <TextInput
              class='code'
              rows={5}
              controlState={this.formState.controls.evalFunctionBody}
              onAction={a => this.onAction(a)}
            />
          </FormField>
        }

        {!this.nodeIsCustom && this.parameterNames.length > 0 &&
          <div class='content'>

            <h5>Parameter Values</h5>

            {
              this.parameterNames.map(name =>
                <FormField
                  key={name}
                  label={name}
                  tooltip={this.getParameterDescription(name)}
                  controlState={this.getParameterControlState(name)}
                  errorMessages={{ required: 'Please enter a value' }}
                >

                  {this.getParameterValueType(name) === 'string' &&
                    <TextInput
                      controlState={this.getParameterControlState(name)}
                      onAction={a => this.onAction(a)}
                    />
                  }

                  {this.getParameterValueType(name) === 'number' &&
                    <NumberInput
                      controlState={this.getParameterControlState(name)}
                      onAction={a => this.onAction(a)}
                    />
                  }

                  {this.getParameterValueType(name) === 'boolean' &&
                    <RadioInput
                      options={{ True: true, False: false }}
                      controlState={this.getParameterControlState(name)}
                      onAction={a => this.onAction(a)}
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
