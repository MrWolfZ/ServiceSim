import uuid from 'uuid';

import * as eser from '../../infrastructure/event-sourced-entity-repository';
import * as esre from '../../infrastructure/event-sourced-root-entity';
import * as irws from './invocation-response-was-set';
import * as srr from './service-request-received';

export interface ServiceInvocation extends esre.EventSourcedRootEntity<DomainEvents> {
  state: 'processing pending' | 'response set';
  request: ServiceRequest;
  response: ServiceResponse;
}

export interface ServiceRequest {
  path: string;
  body: string;
}

export interface ServiceResponse {
  statusCode: number;
  body: string;
}

export const NULL: ServiceInvocation = {
  ...esre.NULL,
  state: 'processing pending',
  request: {
    path: '',
    body: '',
  },
  response: {
    statusCode: 0,
    body: '',
  },
};

export type DomainEvents =
  | srr.ServiceRequestReceived
  | irws.InvocationResponseWasSet
  ;

export const EVENT_HANDLER_MAP: esre.EntityEventHandlerMap<ServiceInvocation, DomainEvents> = {
  [srr.KIND]: (e, ev): ServiceInvocation => {
    return {
      ...e,
      id: ev.invocationId,
      request: {
        path: ev.path,
        body: ev.body,
      },
    };
  },
  [irws.KIND]: (e, ev): ServiceInvocation => {
    return {
      ...e,
      id: ev.invocationId,
      state: 'response set',
      response: {
        statusCode: ev.statusCode,
        body: ev.responseBody,
      },
    };
  },
};

export const apply = esre.createApply(EVENT_HANDLER_MAP);
export const createFromEvents = esre.createFromEvents(NULL, EVENT_HANDLER_MAP);

export const create = (
  path: string,
  body: string,
) => apply(NULL, srr.create({
  invocationId: `service-invocation/${uuid()}`,
  path,
  body,
}));

export const setResponse = (
  invocation: ServiceInvocation,
  statusCode: number,
  responseBody: string,
) => apply(invocation, irws.create({
  invocationId: invocation.id,
  statusCode,
  responseBody,
}));

const JOURNAL_NAME = 'service-invocation/Journal';

export const ofIdAsync = eser.entityOfIdAsync(JOURNAL_NAME, apply, createFromEvents);
export const saveAsync = eser.saveAsync<ServiceInvocation, DomainEvents>(JOURNAL_NAME);
export const saveSnapshotAsync = eser.saveSnapshotAsync<ServiceInvocation, DomainEvents>(JOURNAL_NAME);
