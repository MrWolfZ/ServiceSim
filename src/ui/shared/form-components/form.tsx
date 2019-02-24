import { Action, FormGroupState, MarkAsSubmittedAction } from 'pure-forms';
import { pure, PureComponentContext } from 'src/ui/infrastructure/tsx';

export interface FormProps {
  formState: FormGroupState<any>;
  onAction: (action: Action) => any;
}

export const Form = pure(({ formState, onAction }: FormProps, { slots }: PureComponentContext) => {
  return (
    <form novalidate='novalidate' onSubmit={onSubmit}>
      {slots.default}
    </form>
  );

  function onSubmit(e: Event) {
    e.preventDefault();
    onAction(new MarkAsSubmittedAction(formState.id));
  }
});
