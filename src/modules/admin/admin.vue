<script lang="tsx">
import axios from 'axios';
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class AdminPage extends Vue {
  private async sendResetToDefaultDataAsync() {
    await axios.post('admin/resetToDefaultData');
  }

  render() {
    return (
      <div class='page'>
        <div class='columns'>
          <div class='column is-12-tablet is-6-desktop is-8-widescreen tree-column'>
            <h1 class='title'>
              Admin
            </h1>

            <button
              class='button is-danger'
              onClick={() => this.sendResetToDefaultDataAsync()}
            >
              <span>Reset to default data</span>
              <span class='icon is-small'>
                <fa-icon icon='exclamation' />
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
</script>

<style scoped lang="scss">
</style>
