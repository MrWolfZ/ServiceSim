import { stateful } from 'src/ui/infrastructure/stateful-component';
import { Page } from 'src/ui/shared/common-components/layout/page';

export interface ServicesConfigurationPageProps {
}

export interface ServicesConfigurationPageState {
}

const initialState: ServicesConfigurationPageState = {};

export const ServicesConfigurationPage = stateful<ServicesConfigurationPageState, ServicesConfigurationPageProps>(
  initialState,
  {},
  function ServicesConfigurationPage() {
    return (
      <Page title='Services'>
        ServicesConfiguration works
      </Page>
    );
  },
);

export default ServicesConfigurationPage;
