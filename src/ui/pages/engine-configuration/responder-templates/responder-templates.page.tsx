import { stateful } from 'src/ui/infrastructure/stateful-component';
import { Page } from 'src/ui/shared/common-components/layout/page';

export interface ResponderTemplatesPageProps {
}

export interface ResponderTemplatesPageState {
}

const initialState: ResponderTemplatesPageState = {};

export const ResponderTemplatesPage = stateful<ResponderTemplatesPageState, ResponderTemplatesPageProps>(
  initialState,
  {},
  function ResponderTemplatesPage() {
    return (
      <Page title='Responder Templates'>
        ResponderTemplates works
      </Page>
    );
  },
);

export default ResponderTemplatesPage;
