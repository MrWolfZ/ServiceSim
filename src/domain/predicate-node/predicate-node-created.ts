import { DomainEvent } from '../../infrastructure';
import { PredicateTemplateVersionSnapshot } from './predicate-template-version-snapshot';

export class PredicateNodeCreated extends DomainEvent<typeof PredicateNodeCreated.KIND> {
  nodeId: string;
  predicateTemplateVersionSnapshot: PredicateTemplateVersionSnapshot;
  name: string;
  parameterValues: { [prop: string]: string | number | boolean };
  parentNodeId: string | undefined;

  static readonly KIND = 'predicate/PredicateNodeCreated';
  static readonly create = DomainEvent.createBase(PredicateNodeCreated);
}
