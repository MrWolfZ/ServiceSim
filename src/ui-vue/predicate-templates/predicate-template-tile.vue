<script lang="tsx">
import { Component, Prop } from 'vue-property-decorator';
import TsxComponent from '../infrastructure/tsx-component';

@Component({
  components: {},
})
export default class PredicateTemplateTile extends TsxComponent<{ templateId: string }> {
  @Prop() templateId!: string;

  render() {
    return <div></div>;
  }
}
</script>

<style scoped lang="scss">
</style>
