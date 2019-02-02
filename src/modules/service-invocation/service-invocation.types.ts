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

export interface ServiceInvocationDto extends ServiceInvocationData { }

export interface ServiceInvocationState extends ServiceInvocationDto { }

export interface CreateServiceInvocationCommand extends ServiceRequest { }

export interface SetServiceResponseCommand extends ServiceResponse {
  invocationId: string;
  unmodifiedInvocationVersion: number;
}
