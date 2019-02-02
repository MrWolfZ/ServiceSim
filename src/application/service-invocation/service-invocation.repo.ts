import { ServiceInvocationAggregate, ServiceInvocationDomainEvents } from 'src/domain/service-invocation';
import { eventDrivenRepository } from 'src/infrastructure/db';

export const serviceInvocationRepo = eventDrivenRepository<ServiceInvocationAggregate, ServiceInvocationDomainEvents>('service-invocation', {
  InvocationResponseWasSet: (aggregate, evt) => {
    return {
      ...aggregate,
      response: {
        statusCode: evt.statusCode,
        body: evt.body,
        contentType: evt.contentType,
      },
    };
  },
});
