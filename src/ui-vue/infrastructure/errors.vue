<script lang="tsx">
import { Component, Vue } from 'vue-property-decorator';
import errors from '../domain/errors';

@Component({
  components: {},
})
export default class ErrorsView extends Vue {
  get apiError() {
    return errors.state.apiError;
  }

  render() {
    if (!this.apiError) {
      return null;
    }

    return (
      <div>{this.apiError.message}</div>
    );
  }
}
</script>

<style scoped lang="scss">
</style>
