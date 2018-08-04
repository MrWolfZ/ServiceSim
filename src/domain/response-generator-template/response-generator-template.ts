import uuid from 'uuid';

import { EventHandlerMap, EventSourcedEntityRepository, EventSourcedRootEntity } from '../../infrastructure';
import { Parameter } from '../parameter';
import { ResponseGeneratorTemplateCreatedOrUpdated } from './response-generator-template-created-or-updated';

const JOURNAL_NAME = 'response-generator-template/Journal';

type DomainEvents =
  | ResponseGeneratorTemplateCreatedOrUpdated
  ;

export class ResponseGeneratorTemplate extends EventSourcedRootEntity<DomainEvents> {
  name = '';
  description = '';
  parameters: Parameter[] = [];
  generatorFunctionBody = 'return { statusCode: 500, body: \'missing generator function body\' }';

  static create(
    name: string,
    description: string,
    generatorFunctionBody: string,
    parameters: Parameter[],
  ) {
    return new ResponseGeneratorTemplate().apply(ResponseGeneratorTemplateCreatedOrUpdated.create({
      templateId: `response-generator-template/${uuid()}`,
      name,
      description,
      generatorFunctionBody,
      parameters,
    }));
  }

  update(
    name: string,
    description: string,
    generatorFunctionBody: string,
    parameters: Parameter[],
  ) {
    return this.apply(ResponseGeneratorTemplateCreatedOrUpdated.create({
      templateId: this.id,
      name,
      description,
      generatorFunctionBody,
      parameters,
    }));
  }

  EVENT_HANDLERS: EventHandlerMap<DomainEvents> = {
    [ResponseGeneratorTemplateCreatedOrUpdated.KIND]: event => {
      this.id = event.templateId;
      this.name = event.name;
      this.description = event.description;
      this.generatorFunctionBody = event.generatorFunctionBody,
      this.parameters = event.parameters;
    },
  };

  static readonly fromEvents = EventSourcedRootEntity.fromEventsBase<ResponseGeneratorTemplate, DomainEvents>(ResponseGeneratorTemplate);
  static readonly ofIdAsync = EventSourcedEntityRepository.entityOfIdAsync(JOURNAL_NAME, ResponseGeneratorTemplate.fromEvents);
  static readonly saveAsync = EventSourcedEntityRepository.saveAsync<ResponseGeneratorTemplate, DomainEvents>(JOURNAL_NAME);
  static readonly saveSnapshotAsync = EventSourcedEntityRepository.saveSnapshotAsync<ResponseGeneratorTemplate, DomainEvents>(JOURNAL_NAME);
}
