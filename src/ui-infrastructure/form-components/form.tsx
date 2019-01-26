import { Action, FormGroupState, MarkAsSubmittedAction } from 'pure-forms';
import { RenderContext } from 'vue';
import { pure } from '../tsx';

export interface FormProps {
  formState: FormGroupState<any>;
  onAction: (action: Action) => any;
}

const FormDef = ({ formState, onAction }: FormProps, context: RenderContext<FormProps>) => {
  return (
    <form novalidate='novalidate' onSubmit={onSubmit}>
      {context.slots().default}
    </form>
  );

  function onSubmit(e: Event) {
    e.preventDefault();
    onAction(new MarkAsSubmittedAction(formState.id));
  }
};

export const Form = pure(FormDef);
