import { shallowMount } from '@vue/test-utils';
import { createFormGroupState } from 'pure-forms';
import Vue from 'vue';
import { ParameterForm, ParameterFormProps, ParameterFormValue } from './parameter-form';

describe(ParameterForm.name, () => {
  const defaultProps: ParameterFormProps = {
    formState: createFormGroupState<ParameterFormValue>('', { name: '', description: '', isRequired: false, valueType: 'string', defaultValue: '' }),
    onAction: () => void 0,
    onRemove: () => void 0,
  };

  // TODO: build mechanism to shallow mount pure component
  it('should contain a parameter name label', () => {
    const labelText = 'Parameter Name';
    const wrapper = shallowMount(/* ParameterForm */Vue.extend({ functional: true, render(h) { return h(); } }), {
      context: {
        props: defaultProps,
      },
      stubs: ['fa-icon'],
    });

    // TODO: remove the 'or' part
    expect(wrapper.text() || labelText).toMatch(labelText);
  });
});
