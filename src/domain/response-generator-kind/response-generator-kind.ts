import uuid from 'uuid';

import * as eser from '../../infrastructure/event-sourced-entity-repository';
import * as esre from '../../infrastructure/event-sourced-root-entity';
import * as pda from './property-descriptor-added';
import * as rgkc from './response-generator-kind-created';

export interface ResponseGeneratorKind extends esre.EventSourcedRootEntity<DomainEvents> {
  name: string;
  description: string;
  propertyDescriptors: PropertyDescriptor[];
  generatorFunctionBody: string;
}

export interface PropertyDescriptor {
  name: string;
  description: string;
  isRequired: boolean;
  valueType: 'string' | 'boolean' | 'number';
}

export const NULL: ResponseGeneratorKind = {
  ...esre.NULL,
  name: '',
  description: '',
  propertyDescriptors: [],
  generatorFunctionBody: 'return { statusCode: 500, body: \'missing generator function body\' }',
};

export type DomainEvents =
  | rgkc.ResponseGeneratorKindCreated
  | pda.PropertyDescriptorAdded
  ;

export const EVENT_HANDLER_MAP: esre.EntityEventHandlerMap<ResponseGeneratorKind, DomainEvents> = {
  [rgkc.KIND]: (e, ev): ResponseGeneratorKind => {
    return {
      ...e,
      id: ev.responseGeneratorKindId,
      name: ev.name,
      description: ev.description,
    };
  },
  [pda.KIND]: (e, ev): ResponseGeneratorKind => {
    return {
      ...e,
      propertyDescriptors: [
        ...e.propertyDescriptors,
        {
          name: ev.name,
          description: ev.description,
          isRequired: ev.isRequired,
          valueType: ev.valueType,
        },
      ],
    };
  },
};

export const apply = esre.createApply(EVENT_HANDLER_MAP);
export const createFromEvents = esre.createFromEvents(NULL, EVENT_HANDLER_MAP);

export const create = (
  name: string,
  description: string,
  generatorFunctionBody: string,
) => apply(NULL, rgkc.create({
  responseGeneratorKindId: `response-generator-kind/${uuid()}`,
  name,
  description,
  generatorFunctionBody,
}));

export const addPropertyDescriptor = (
  responseGeneratorKind: ResponseGeneratorKind,
  name: string,
  description: string,
  isRequired: boolean,
  valueType: 'string' | 'boolean' | 'number',
) => apply(responseGeneratorKind, pda.create({
  responseGeneratorKindId: responseGeneratorKind.id,
  name,
  description,
  isRequired,
  valueType,
}));

const JOURNAL_NAME = 'response-generator-kind/Journal';

export const ofIdAsync = eser.entityOfIdAsync(JOURNAL_NAME, apply, createFromEvents);
export const saveAsync = eser.saveAsync<ResponseGeneratorKind, DomainEvents>(JOURNAL_NAME);
export const saveSnapshotAsync = eser.saveSnapshotAsync<ResponseGeneratorKind, DomainEvents>(JOURNAL_NAME);
