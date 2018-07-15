import * as de from '../../infrastructure/domain-event';

export const KIND = 'response-generator/ResponseGeneratorCreated';

export interface ResponseGeneratorCreated extends de.DomainEvent<typeof KIND> {
  responseGeneratorId: string;
  responseGeneratorKindId: string;
  properties: { [prop: string]: string | number | boolean };
}

export const create = de.create<ResponseGeneratorCreated>(KIND);
