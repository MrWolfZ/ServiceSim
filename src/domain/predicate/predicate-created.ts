import * as de from '../../infrastructure/domain-event';

export const KIND = 'predicate/PredicateCreated';

export interface PredicateCreated extends de.DomainEvent<typeof KIND> {
  predicateId: string;
  predicateKindId: string;
  properties: { [prop: string]: string | number | boolean };
}

export const create = de.create<PredicateCreated>(KIND);
