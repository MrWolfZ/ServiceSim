import { DomainEvent } from '../../api-infrastructure';
import { Parameter } from '../parameter/parameter';

export class PredicateTemplateCreatedOrUpdated extends DomainEvent<typeof PredicateTemplateCreatedOrUpdated.KIND> {
  templateId: string;
  name: string;
  description: string;
  evalFunctionBody: string;
  parameters: Parameter[];

  static readonly KIND = 'predicate-template/PredicateTemplateCreatedOrUpdated';
  static readonly create = DomainEvent.createBase(PredicateTemplateCreatedOrUpdated);
}
