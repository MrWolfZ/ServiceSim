import { resetToDefaultData } from 'src/application/admin/commands/reset-to-default-data';
import { DangerButton } from 'src/ui/shared/common-components/button';
import { Page } from 'src/ui/shared/common-components/layout/page';
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class AdminPage extends Vue {
  private async sendResetToDefaultDataAsync() {
    await resetToDefaultData({});
  }

  render() {
    return (
      <Page title='Admin'>
        <div>
          <DangerButton
            label='Reset to default data'
            icon='exclamation'
            onClick={() => this.sendResetToDefaultDataAsync()}
          />
        </div>
      </Page>
    );
  }
}
