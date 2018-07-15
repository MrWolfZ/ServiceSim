import * as de from '../../infrastructure/domain-event';

export const KIND = 'response-generator-kind/ResponseGeneratorKindCreated';

export interface ResponseGeneratorKindCreated extends de.DomainEvent<typeof KIND> {
  responseGeneratorKindId: string;
  name: string;
  description: string;
  generatorFunctionBody: string;
}

export const create = de.create<ResponseGeneratorKindCreated>(KIND);
