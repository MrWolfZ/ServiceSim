import { DomainEvent } from '../../infrastructure';

export class ServiceRequestReceived extends DomainEvent<typeof ServiceRequestReceived.KIND> {
  invocationId: string;
  path: string;
  body: string;

  static readonly KIND = 'service-invocation/ServiceRequestReceived';
  static readonly create = DomainEvent.createBase(ServiceRequestReceived);
}
