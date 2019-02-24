import { FormControlState } from 'pure-forms';
import { pure, PureComponentContext } from 'src/ui/infrastructure/tsx';
import { ExpansionContainer } from '../expansion-container';

export interface FormFieldProps {
  label?: string;
  tooltip?: string;
  tooltipIcon?: string;
  controlState: FormControlState<any>;
  errorMessageFactory?: (errorName: string, errorValue: any) => string;
  errorMessages?: { [errorName: string]: string };
}

export const FormField = pure((
  { label, tooltip, tooltipIcon, controlState, errorMessageFactory, errorMessages }: FormFieldProps,
  { slots }: PureComponentContext,
) => {
  const errorNames = Object.keys(controlState.errors);
  const errorsAreShown = controlState.isInvalid && (controlState.isSubmitted || controlState.isTouched);

  return (
    <div class='field'>

      {label &&
        <label class='label'>
          {label}

          {tooltip &&
            <span class='tooltip is-tooltip-primary is-tooltip-right' style={{ marginLeft: '0.25rem' }} data-tooltip={tooltip}>
              <fa-icon icon={tooltipIcon || 'info-circle'} />
            </span>
          }
        </label>
      }

      <div class='control'>
        {slots.default}
        <ExpansionContainer isExpanded={errorsAreShown}>
          {
            errorNames.map(name =>
              <span key={name} class='help is-danger'>
                {getErrorMessage(name)}
              </span>
            )
          }
        </ExpansionContainer>
      </div>

    </div>
  );

  function getErrorMessage(errorName: string) {
    let errorMessage = errorName;

    if (errorMessageFactory) {
      errorMessage = errorMessageFactory(name, controlState.errors[name]) || errorMessage;
    }

    if (errorMessages) {
      errorMessage = errorMessages[errorName] || errorMessage;
    }

    return errorMessage;
  }
});
