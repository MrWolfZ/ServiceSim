import { DomainEvent } from '../../infrastructure';

export class ResponseGeneratorSet extends DomainEvent<typeof ResponseGeneratorSet.KIND> {
  predicateId: string;
  responseGeneratorKindId: string;
  parameters: { [prop: string]: string | number | boolean };

  static readonly KIND = 'predicate/ResponseGeneratorSet';
  static readonly create = DomainEvent.createBase(ResponseGeneratorSet);
}
