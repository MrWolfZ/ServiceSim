import { resetToDefaultData } from 'src/application/admin/commands/reset-to-default-data';
import { DangerButton } from 'src/ui/shared/common-components/button';
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class AdminPage extends Vue {
  private async sendResetToDefaultDataAsync() {
    await resetToDefaultData({});
  }

  render() {
    return (
      <div class='page'>
        <div class='columns'>
          <div class='column'>
            <h1 class='title'>
              Admin
            </h1>

            <DangerButton
              label='Reset to default data'
              icon='exclamation'
              onClick={() => this.sendResetToDefaultDataAsync()}
            />
          </div>
        </div>
      </div>
    );
  }
}
