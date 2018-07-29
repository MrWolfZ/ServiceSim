import { DomainEvent } from '../../infrastructure';

export class InvocationResponseWasSet extends DomainEvent<typeof InvocationResponseWasSet.KIND> {
  invocationId: string;
  statusCode: number;
  body: string;
  contentType: string;

  static readonly KIND = 'service-invocation/InvocationResponseWasSet';
  static readonly create = DomainEvent.createBase(InvocationResponseWasSet);
}
