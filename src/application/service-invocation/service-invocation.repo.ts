import { SERVICE_INVOCATION_AGGREGATE_TYPE, ServiceInvocationAggregate, ServiceInvocationDomainEvents } from 'src/domain/service-invocation';
import { eventDrivenRepository } from 'src/infrastructure/db';

export const serviceInvocationRepo = eventDrivenRepository<ServiceInvocationAggregate, ServiceInvocationDomainEvents>(
  SERVICE_INVOCATION_AGGREGATE_TYPE,
  {
    InvocationResponseWasSet: (aggregate, evt) => {
      return {
        ...aggregate,
        status: 'response is set',
        response: {
          statusCode: evt.statusCode,
          body: evt.body,
          contentType: evt.contentType,
        },
      };
    },
  },
);
