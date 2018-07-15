import uuid from 'uuid';

import * as eser from '../../infrastructure/event-sourced-entity-repository';
import * as esre from '../../infrastructure/event-sourced-root-entity';
import * as rgc from './response-generator-created';

export interface ResponseGenerator extends esre.EventSourcedRootEntity<DomainEvents> {
  responseGeneratorKindId: string;
  properties: { [prop: string]: string | number | boolean };
}

export const NULL: ResponseGenerator = {
  ...esre.NULL,
  responseGeneratorKindId: '',
  properties: {},
};

export type DomainEvents =
  | rgc.ResponseGeneratorCreated
  ;

export const EVENT_HANDLER_MAP: esre.EntityEventHandlerMap<ResponseGenerator, DomainEvents> = {
  [rgc.KIND]: (e, ev): ResponseGenerator => {
    return {
      ...e,
      id: ev.responseGeneratorId,
      responseGeneratorKindId: ev.responseGeneratorKindId,
      properties: ev.properties,
    };
  },
};

export const apply = esre.createApply(EVENT_HANDLER_MAP);
export const createFromEvents = esre.createFromEvents(NULL, EVENT_HANDLER_MAP);

export const create = (
  responseGeneratorKindId: string,
  properties: { [prop: string]: string | number | boolean } = {},
) => apply(NULL, rgc.create({
  responseGeneratorId: `response-generator/${uuid()}`,
  responseGeneratorKindId,
  properties,
}));

const JOURNAL_NAME = 'response-generator/Journal';

export const ofIdAsync = eser.entityOfIdAsync(JOURNAL_NAME, apply, createFromEvents);
export const saveAsync = eser.saveAsync<ResponseGenerator, DomainEvents>(JOURNAL_NAME);
export const saveSnapshotAsync = eser.saveSnapshotAsync<ResponseGenerator, DomainEvents>(JOURNAL_NAME);
