<script lang="tsx">
import { Component, Prop } from 'vue-property-decorator';
import { TsxComponent } from './tsx-component';

@Component({
  components: {},
})
export default class ExpansionContainer extends TsxComponent<{ isExpanded: boolean }> {
  @Prop() isExpanded: boolean;

  render() {
    return (
      <div>
        {this.isExpanded &&
          <transition>
            {this.$slots.default}
          </transition>
        }
      </div>
    );
  }
}
</script>

<style scoped lang="scss">
</style>
