import { shallowMount } from '@vue/test-utils';
import { createFormGroupState } from 'pure-forms';
import { ParameterForm, ParameterFormProps, ParameterFormValue } from './parameter-form';

describe(ParameterForm.name, () => {
  const defaultProps: ParameterFormProps = {
    formState: createFormGroupState<ParameterFormValue>('', { name: '', description: '', isRequired: false, valueType: 'string', defaultValue: '' }),
    onAction: () => void 0,
    onRemove: () => void 0,
  };

  it('should contain a parameter name label', () => {
    const labelText = 'Parameter Name';
    const wrapper = shallowMount(ParameterForm, {
      context: {
        props: defaultProps,
      },
      stubs: ['fa-icon'],
    });
    expect(wrapper.text()).toMatch(labelText);
  });
});
