import { Action, FormGroupState, MarkAsSubmittedAction } from 'pure-forms';
import { pure, PureComponentContext } from 'src/ui/infrastructure/tsx';

export interface FormProps {
  formState: FormGroupState<any>;
  onAction: (action: Action) => any;
}

const FormDef = ({ formState, onAction }: FormProps, { slots }: PureComponentContext) => {
  return (
    <form novalidate='novalidate' onSubmit={onSubmit}>
      {slots.default}
    </form>
  );

  function onSubmit(e: Event) {
    e.preventDefault();
    onAction(new MarkAsSubmittedAction(formState.id));
  }
};

export const Form = pure(FormDef);
