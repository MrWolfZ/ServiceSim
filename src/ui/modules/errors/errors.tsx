import { Component, Vue } from 'vue-property-decorator';
import errors from './errors.store';

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
