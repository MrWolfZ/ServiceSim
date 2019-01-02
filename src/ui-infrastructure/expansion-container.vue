<script lang="tsx">
import { Component, Prop } from 'vue-property-decorator';
import smoothReflow from 'vue-smooth-reflow';
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
</script>

<style lang="scss">
.expansion-container {
  overflow: hidden;
  transition: opacity 200ms ease;

  &.is-collapsed {
    height: 0;
    padding-top: 0;
    padding-bottom: 0;
    opacity: 0;
    margin-top: 0;
    margin-bottom: 0;
  }

  &.is-expanded {
    opacity: 1;
  }
}
</style>
