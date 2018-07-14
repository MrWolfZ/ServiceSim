import * as de from '../../infrastructure/domain-event';

export const KIND = 'service-invocation/InvocationResponseWasSet';

export interface InvocationResponseWasSet extends de.DomainEvent<typeof KIND> {
  invocationId: string;
  statusCode: number;
  responseBody: string;
}

export const create = de.create<InvocationResponseWasSet>(KIND);
