import * as de from '../../infrastructure/domain-event';

export const KIND = 'predicate/ResponseGeneratorSet';

export interface ResponseGeneratorSet extends de.DomainEvent<typeof KIND> {
  predicateId: string;
  responseGeneratorId: string;
}

export const create = de.create<ResponseGeneratorSet>(KIND);
