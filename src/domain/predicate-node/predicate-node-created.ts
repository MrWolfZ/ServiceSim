import { DomainEvent } from '../../infrastructure';
import { PredicateTemplateVersionSnapshot } from './predicate-template-version-snapshot';

export class PredicateNodeCreated extends DomainEvent<typeof PredicateNodeCreated.KIND> {
  nodeId: string;
  predicateTemplateVersionSnapshot: PredicateTemplateVersionSnapshot;
  parameterValues: { [prop: string]: string | number | boolean };
  parentNodeId: string | undefined;

  static readonly KIND = 'predicate/PredicateCreated';
  static readonly create = DomainEvent.createBase(PredicateNodeCreated);
}
