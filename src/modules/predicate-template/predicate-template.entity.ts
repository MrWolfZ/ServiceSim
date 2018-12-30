import uuid from 'uuid';
import { EventSourcedEntityRepository, EventSourcedRootEntity } from '../../api-infrastructure';
import { Parameter } from '../parameter/parameter.types';
import {
  createEventHandlerMap,
  PredicateTemplateCreated,
  PredicateTemplateDeleted,
  PredicateTemplateDomainEvents,
  PredicateTemplateUpdated,
} from './predicate-template.events';
import { PredicateTemplateData, PredicateTemplateEntity } from './predicate-template.types';

const JOURNAL_NAME = 'predicate-template/Journal';

export class PredicateTemplate extends EventSourcedRootEntity<PredicateTemplateDomainEvents> implements PredicateTemplateEntity {
  name = '';
  description = '';
  parameters: Parameter[] = [];
  evalFunctionBody = 'return true;';

  static create(data: PredicateTemplateData, id?: string) {
    return new PredicateTemplate().apply(PredicateTemplateCreated.create({
      templateId: id || `predicateTemplate.${uuid()}`,
      data,
    }));
  }

  update(data: Partial<PredicateTemplateData>) {
    return this.apply(PredicateTemplateUpdated.create({
      templateId: this.id,
      data,
    }));
  }

  delete() {
    return this.apply(PredicateTemplateDeleted.create({
      templateId: this.id,
    }));
  }

  EVENT_HANDLERS = createEventHandlerMap(this);

  static readonly fromEvents = EventSourcedRootEntity.fromEventsBase<PredicateTemplate, PredicateTemplateDomainEvents>(PredicateTemplate);
  static readonly ofIdAsync = EventSourcedEntityRepository.entityOfIdAsync(JOURNAL_NAME, PredicateTemplate.fromEvents);
  static readonly saveAsync = EventSourcedEntityRepository.saveAsync<PredicateTemplate, PredicateTemplateDomainEvents>(JOURNAL_NAME);
  static readonly saveSnapshotAsync = EventSourcedEntityRepository.saveSnapshotAsync<PredicateTemplate, PredicateTemplateDomainEvents>(JOURNAL_NAME);
}
