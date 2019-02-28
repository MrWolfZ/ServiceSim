import { stateful } from 'src/ui/infrastructure/stateful-component';
import { Page } from 'src/ui/shared/common-components/layout/page';

export interface ConditionTemplatesPageProps {
}

export interface ConditionTemplatesPageState {
}

const initialState: ConditionTemplatesPageState = {};

export const ConditionTemplatesPage = stateful<ConditionTemplatesPageState, ConditionTemplatesPageProps>(
  initialState,
  {},
  function ConditionTemplatesPage() {
    return (
      <Page title='Condition Templates'>
        ConditionTemplates works
      </Page>
    );
  },
);

export default ConditionTemplatesPage;
