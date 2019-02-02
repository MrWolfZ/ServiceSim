import { Aggregate, DomainEvent } from 'src/domain/infrastructure/ddd';

export interface ServiceRequest {
  path: string;
  body: string;
}

export interface ServiceResponse {
  statusCode: number;
  body: string;
  contentType: string;
}

export interface ServiceInvocationData {
  state: 'processing pending' | 'response set';
  request: ServiceRequest;
  response: ServiceResponse | undefined;
}

export type ServiceInvocationAggregateType = 'service-invocation';

export type ServiceInvocationAggregate = ServiceInvocationData & Aggregate<ServiceInvocationAggregateType>;

export interface InvocationResponseWasSet extends DomainEvent<ServiceInvocationAggregateType, 'InvocationResponseWasSet'> {
  statusCode: number;
  body: string;
  contentType: string;
}

export type ServiceInvocationDomainEvents =
  | InvocationResponseWasSet
  ;
