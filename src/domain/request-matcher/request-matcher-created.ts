import { createFactory, DomainEvent } from '../../infrastructure/domain-event';

export const KIND = 'request-matcher/RequestMatcherCreated';

export interface RequestMatcherCreated extends DomainEvent<typeof KIND> {
  id: string;
  matcherKind: string;
  properties: { [prop: string]: any };
}

export function create(
  id: string,
  matcherKind: string,
  properties: { [prop: string]: any },
): RequestMatcherCreated {
  return createFactory<RequestMatcherCreated, typeof KIND>(
    KIND,
    ev => ({
      ...ev,
      id,
      matcherKind,
      properties,
    }),
  )();
}
