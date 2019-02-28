import { Observable } from 'rxjs';
import { createService } from 'src/application/service/commands/create-service';
import { allServices$ } from 'src/application/service/queries/observe-all-services';
import { ServiceAggregate } from 'src/domain/service';
import { stateful } from 'src/ui/infrastructure/stateful-component';
import { PrimaryButton } from 'src/ui/shared/common-components/button';
import { Page } from 'src/ui/shared/common-components/layout/page';

export interface ServicesConfigurationPageProps {
  services: Observable<ServiceAggregate[]>;
}

export interface ServicesConfigurationPageState {
}

const initialState: ServicesConfigurationPageState = {};

export const ServicesConfigurationPage = stateful<ServicesConfigurationPageState, ServicesConfigurationPageProps>(
  initialState,
  { services: allServices$ },
  function ServicesConfigurationPage({ services }) {
    return (
      <Page title='Services'>
        {
          services.map(s =>
            <div>
              {s.name}
            </div>
          )
        }

        <PrimaryButton onClick={createMockService}>
          Create mock service
        </PrimaryButton>
      </Page>
    );

    async function createMockService() {
      await createService({ name: 'test', description: '', pathRegex: '' });
    }
  },
);

export default ServicesConfigurationPage;
