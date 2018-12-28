import { shallowMount } from '@vue/test-utils';
import ParameterForm from './parameter-form.vue';

describe(`${ParameterForm.name}.vue`, () => {
  it('should contain a parameter name label', () => {
    const labelText = 'Parameter Name';
    const wrapper = shallowMount(ParameterForm, {
      propsData: {
        formValue: {},
      },
      stubs: ['fa-icon'],
    });
    expect(wrapper.text()).toMatch(labelText);
  });
});
