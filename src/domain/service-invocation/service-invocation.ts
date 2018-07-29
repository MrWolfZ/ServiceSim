import uuid from 'uuid';

import { EventHandlerMap, EventSourcedEntityRepository, EventSourcedRootEntity } from '../../infrastructure';
import { InvocationResponseWasSet } from './invocation-response-was-set';
import { ServiceRequestReceived } from './service-request-received';

const JOURNAL_NAME = 'service-invocation/Journal';

type DomainEvents =
  | ServiceRequestReceived
  | InvocationResponseWasSet
  ;

export interface ServiceRequest {
  path: string;
  body: string;
}

export interface ServiceResponse {
  statusCode: number;
  body: string;
  contentType: string;
}

export class ServiceInvocation extends EventSourcedRootEntity<DomainEvents> {
  state: 'processing pending' | 'response set' = 'processing pending';

  request: ServiceRequest = {
    path: '',
    body: '',
  };

  response: ServiceResponse = {
    statusCode: 0,
    body: '',
    contentType: '',
  };

  static create(
    path: string,
    body: string,
  ) {
    return new ServiceInvocation().apply(ServiceRequestReceived.create({
      invocationId: `service-invocation/${uuid()}`,
      path,
      body,
    }));
  }

  setResponse = (
    statusCode: number,
    body: string,
    contentType: string,
  ) => {
    return this.apply(InvocationResponseWasSet.create({
      invocationId: this.id,
      statusCode,
      body,
      contentType,
    }));
  }

  EVENT_HANDLERS: EventHandlerMap<DomainEvents> = {
    [ServiceRequestReceived.KIND]: event => {
      this.id = event.invocationId;
      this.request = {
        path: event.path,
        body: event.body,
      };
    },
    [InvocationResponseWasSet.KIND]: event => {
      this.state = 'response set';
      this.response = {
        statusCode: event.statusCode,
        body: event.body,
        contentType: event.contentType,
      };
    },
  };

  static readonly fromEvents = EventSourcedRootEntity.fromEventsBase<ServiceInvocation, DomainEvents>(ServiceInvocation);
  static readonly ofIdAsync = EventSourcedEntityRepository.entityOfIdAsync(JOURNAL_NAME, ServiceInvocation.fromEvents);
  static readonly saveAsync = EventSourcedEntityRepository.saveAsync<ServiceInvocation, DomainEvents>(JOURNAL_NAME);
  static readonly saveSnapshotAsync = EventSourcedEntityRepository.saveSnapshotAsync<ServiceInvocation, DomainEvents>(JOURNAL_NAME);
}
