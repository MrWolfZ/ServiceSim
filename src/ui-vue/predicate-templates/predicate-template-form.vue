<script lang="tsx">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {},
})
export default class PredicateTemplateForm extends Vue {
  get isValid() {
    return true;
  }

  get isInvalid() {
    return false;
  }

  get isSubmitted() {
    return false;
  }

  get isUnsubmitted() {
    return true;
  }

  render() {
    return <div></div>;
  }
}
</script>

<style scoped lang="scss">
</style>
