import { DomainEvent } from '../../infrastructure';
import { Parameter } from '../parameter';

export class PredicateTemplateCreatedOrUpdated extends DomainEvent<typeof PredicateTemplateCreatedOrUpdated.KIND> {
  templateId: string;
  name: string;
  description: string;
  evalFunctionBody: string;
  parameters: Parameter[];

  static readonly KIND = 'predicate-template/PredicateTemplateCreatedOrUpdated';
  static readonly create = DomainEvent.createBase(PredicateTemplateCreatedOrUpdated);
}
