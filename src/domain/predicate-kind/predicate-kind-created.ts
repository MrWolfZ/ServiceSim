import * as de from '../../infrastructure/domain-event';

export const KIND = 'predicate-kind/PredicateKindCreated';

export interface PredicateKindCreated extends de.DomainEvent<typeof KIND> {
  predicateKindId: string;
  name: string;
  description: string;
  evalFunctionBody: string;
}

export const create = de.create<PredicateKindCreated>(KIND);
