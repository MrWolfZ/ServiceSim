import { DomainEvent } from '../../infrastructure';
import { PredicateCustomProperties, PredicateTemplateInfo } from './template-info-or-custom-properties';

export class PredicateNodeCreated extends DomainEvent<typeof PredicateNodeCreated.KIND> {
  nodeId: string;
  name: string;
  description: string;
  templateInfoOrCustomProperties: PredicateTemplateInfo | PredicateCustomProperties;
  parentNodeId: string | undefined;

  static readonly KIND = 'predicate/PredicateNodeCreated';
  static readonly create = DomainEvent.createBase(PredicateNodeCreated);
}
