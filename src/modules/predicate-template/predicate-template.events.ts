import { DomainEvent } from '../../api-infrastructure';
import { EventHandlerMap } from '../../api-infrastructure/api-infrastructure.types';
import { PredicateTemplateData, PredicateTemplateEntity } from './predicate-template.types';

export class PredicateTemplateCreated extends DomainEvent<typeof PredicateTemplateCreated.KIND> {
  templateId: string;
  data: PredicateTemplateData;

  static readonly KIND = 'predicate-template/PredicateTemplateCreated';
  static readonly create = DomainEvent.createBase(PredicateTemplateCreated);

  static createApply(instance: PredicateTemplateEntity) {
    return (event: PredicateTemplateCreated) => {
      instance.id = event.templateId;
      Object.assign(instance, event.data);
    };
  }
}

export class PredicateTemplateUpdated extends DomainEvent<typeof PredicateTemplateUpdated.KIND> {
  templateId: string;
  data: Partial<PredicateTemplateData>;

  static readonly KIND = 'predicate-template/PredicateTemplateUpdated';
  static readonly create = DomainEvent.createBase(PredicateTemplateUpdated);

  static createApply(instance: PredicateTemplateEntity) {
    return (event: PredicateTemplateUpdated) => {
      Object.assign(instance, event.data);
    };
  }
}

export class PredicateTemplateDeleted extends DomainEvent<typeof PredicateTemplateDeleted.KIND> {
  templateId: string;

  static readonly KIND = 'predicate-template/PredicateTemplateDeleted';
  static readonly create = DomainEvent.createBase(PredicateTemplateDeleted);

  static createApply(_: PredicateTemplateEntity) {
    return (_: PredicateTemplateDeleted) => {
      // nothing to do
    };
  }
}

export type PredicateTemplateDomainEvents =
  | PredicateTemplateCreated
  | PredicateTemplateUpdated
  | PredicateTemplateDeleted
  ;

export function createEventHandlerMap(instance: PredicateTemplateEntity): EventHandlerMap<PredicateTemplateDomainEvents> {
  return {
    [PredicateTemplateCreated.KIND]: PredicateTemplateCreated.createApply(instance),
    [PredicateTemplateUpdated.KIND]: PredicateTemplateUpdated.createApply(instance),
    [PredicateTemplateDeleted.KIND]: PredicateTemplateDeleted.createApply(instance),
  };
}
