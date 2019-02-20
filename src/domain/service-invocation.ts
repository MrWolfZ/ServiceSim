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

export type ServiceInvocationStatus =
  | 'request is received'
  | 'service operation is determined'
  | 'response is set'
  ;

export interface ServiceInvocationData {
  status: ServiceInvocationStatus;
  request: ServiceRequest;
  serviceOperationId: string | undefined;
  response: ServiceResponse | undefined;
}

export const SERVICE_INVOCATION_AGGREGATE_TYPE = 'ServiceInvocation';
export type ServiceInvocationAggregateType = typeof SERVICE_INVOCATION_AGGREGATE_TYPE;

export type ServiceInvocationAggregate = ServiceInvocationData & Aggregate<ServiceInvocationAggregateType>;

export interface InvocationResponseWasSet extends DomainEvent<ServiceInvocationAggregateType, 'InvocationResponseWasSet'> {
  statusCode: number;
  body: string;
  contentType: string;
}

export type ServiceInvocationDomainEvents =
  | InvocationResponseWasSet
  ;
