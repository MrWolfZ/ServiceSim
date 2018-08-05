import { DomainEvent } from '../../infrastructure';
import { PredicateTemplateSnapshot } from './predicate-template-snapshot';

export class PredicateNodeCreated extends DomainEvent<typeof PredicateNodeCreated.KIND> {
  nodeId: string;
  name: string;
  templateInstanceOrEvalFunctionBody: {
    templateSnapshot: PredicateTemplateSnapshot;
    parameterValues: { [prop: string]: string | number | boolean };
  } | string;
  parentNodeId: string | undefined;

  static readonly KIND = 'predicate/PredicateNodeCreated';
  static readonly create = DomainEvent.createBase(PredicateNodeCreated);
}
