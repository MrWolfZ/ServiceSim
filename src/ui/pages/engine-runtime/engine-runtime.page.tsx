import { stateful } from 'src/ui/infrastructure/stateful-component';
import { Page } from 'src/ui/shared/common-components/layout/page';

export interface EngineRuntimePageProps {
}

export interface EngineRuntimePageState {
}

const initialState: EngineRuntimePageState = {};

export const EngineRuntimePage = stateful<EngineRuntimePageState, EngineRuntimePageProps>(
  initialState,
  {},
  function EngineRuntimePage() {
    return (
      <Page title='Engine Runtime'>
        EngineRuntime works
      </Page>
    );
  },
);

export default EngineRuntimePage;
