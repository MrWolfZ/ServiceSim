import * as de from '../../infrastructure/domain-event';

export const KIND = 'service-invocation/ServiceRequestReceived';

export interface ServiceRequestReceived extends de.DomainEvent<typeof KIND> {
  invocationId: string;
  path: string;
  body: string;
}

export const create = de.create<ServiceRequestReceived>(KIND);
