import { resetToDefaultData } from 'src/application/admin/commands/reset-to-default-data';
import { stateful } from 'src/ui/infrastructure/stateful-component';
import { DangerButton } from 'src/ui/shared/common-components/button';
import { Page } from 'src/ui/shared/common-components/layout/page';

export interface AdminPageProps {
}

export interface AdminPageState {
}

const initialState: AdminPageState = {};

export const AdminPage = stateful<AdminPageState, AdminPageProps>(
  initialState,
  {},
  function AdminPage() {
    return (
      <Page title='Admin'>
        <div>
          <DangerButton
            label='Reset to default data'
            icon='exclamation'
            onClick={sendResetToDefaultDataAsync}
          />
        </div>
      </Page>
    );
  },
);

async function sendResetToDefaultDataAsync() {
  await resetToDefaultData();
}

export default AdminPage;
