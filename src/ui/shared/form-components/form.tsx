import { Action, FormGroupState, MarkAsSubmittedAction } from 'pure-forms';

export interface FormProps extends ComponentProps {
  formState: FormGroupState<any>;
  onAction: (action: Action) => any;
}

export const Form = ({ formState, onAction, children }: FormProps) => {
  return (
    <form novalidate='novalidate' onSubmit={onSubmit}>
      {children}
    </form>
  );

  function onSubmit(e: Event) {
    e.preventDefault();
    onAction(new MarkAsSubmittedAction(formState.id));
  }
};
