import { Observable } from 'rxjs';
import { allServices$ } from 'src/application/service/queries/observe-all-services';
import { ServiceAggregate } from 'src/domain/service';
import { stateful } from 'src/ui/infrastructure/stateful-component';
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
      </Page>
    );
  },
);

export default ServicesConfigurationPage;
