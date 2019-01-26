import { Component, Prop } from 'vue-property-decorator';
import smoothReflow from 'vue-smooth-reflow';
import './expansion-container.scss';
import { TsxComponent } from './tsx-component';

@Component({
  mixins: [smoothReflow],
})
export class ExpansionContainer extends TsxComponent<{ isExpanded: boolean }> {
  @Prop() isExpanded: boolean;

  mounted() {
    this.$smoothReflow!({
      transition: 'height 200ms ease',
    });
  }

  render() {
    return (
      <div class={`expansion-container ${this.isExpanded ? 'is-expanded' : 'is-collapsed'}`}>
        {this.$slots.default}
      </div>
    );
  }
}

export default ExpansionContainer;
