import uuid from 'uuid';

import { EventHandlerMap, EventSourcedEntityRepository, EventSourcedRootEntity } from '../../infrastructure';
import { Parameter } from '../parameter';
import { PredicateTemplateCreatedOrUpdated } from './predicate-template-created-or-updated';
import { PredicateTemplateDeleted } from './predicate-template-deleted';

const JOURNAL_NAME = 'predicate-template/Journal';

type DomainEvents =
  | PredicateTemplateCreatedOrUpdated
  | PredicateTemplateDeleted
  ;

export class PredicateTemplate extends EventSourcedRootEntity<DomainEvents> {
  name = '';
  description = '';
  parameters: Parameter[] = [];
  evalFunctionBody = 'return true;';

  static create(
    name: string,
    description: string,
    evalFunctionBody: string,
    parameters: Parameter[],
  ) {
    return new PredicateTemplate().apply(PredicateTemplateCreatedOrUpdated.create({
      templateId: `predicate-template/${uuid()}`,
      name,
      description,
      evalFunctionBody,
      parameters,
    }));
  }

  update(
    name: string,
    description: string,
    evalFunctionBody: string,
    parameters: Parameter[],
  ) {
    return this.apply(PredicateTemplateCreatedOrUpdated.create({
      templateId: this.id,
      name,
      description,
      evalFunctionBody,
      parameters,
    }));
  }

  delete() {
    return this.apply(PredicateTemplateDeleted.create({
      templateId: this.id,
    }));
  }

  EVENT_HANDLERS: EventHandlerMap<DomainEvents> = {
    [PredicateTemplateCreatedOrUpdated.KIND]: event => {
      this.id = event.templateId;
      this.name = event.name;
      this.description = event.description;
      this.evalFunctionBody = event.evalFunctionBody;
      this.parameters = event.parameters;
    },
    [PredicateTemplateDeleted.KIND]: () => {
      // nothing to do
    },
  };

  static readonly fromEvents = EventSourcedRootEntity.fromEventsBase<PredicateTemplate, DomainEvents>(PredicateTemplate);
  static readonly ofIdAsync = EventSourcedEntityRepository.entityOfIdAsync(JOURNAL_NAME, PredicateTemplate.fromEvents);
  static readonly saveAsync = EventSourcedEntityRepository.saveAsync<PredicateTemplate, DomainEvents>(JOURNAL_NAME);
  static readonly saveSnapshotAsync = EventSourcedEntityRepository.saveSnapshotAsync<PredicateTemplate, DomainEvents>(JOURNAL_NAME);
}
