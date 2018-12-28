import { DomainEvent } from '../../api-infrastructure';

export class PredicateTemplateDeleted extends DomainEvent<typeof PredicateTemplateDeleted.KIND> {
  templateId: string;

  static readonly KIND = 'predicate-template/PredicateTemplateDeleted';
  static readonly create = DomainEvent.createBase(PredicateTemplateDeleted);
}
