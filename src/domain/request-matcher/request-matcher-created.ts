import * as de from '../../infrastructure/domain-event';

export const KIND = 'request-matcher/RequestMatcherCreated';

export interface RequestMatcherCreated extends de.DomainEvent<typeof KIND> {
  id: string;
  matcherKind: string;
  properties: { [prop: string]: any };
}

export const create = de.create<RequestMatcherCreated>(KIND);
