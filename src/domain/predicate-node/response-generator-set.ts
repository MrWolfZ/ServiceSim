import { DomainEvent } from '../../infrastructure';
import { ResponseGeneratorTemplateSnapshot } from './response-generator-template-snapshot';

export class ResponseGeneratorSet extends DomainEvent<typeof ResponseGeneratorSet.KIND> {
  predicateNodeId: string;
  responseGeneratorName: string;
  templateInstanceOrGeneratorFunctionBody: {
    templateSnapshot: ResponseGeneratorTemplateSnapshot;
    parameterValues: { [prop: string]: string | number | boolean };
  } | string;

  static readonly KIND = 'predicate/ResponseGeneratorSet';
  static readonly create = DomainEvent.createBase(ResponseGeneratorSet);
}
