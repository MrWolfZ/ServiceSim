import uuid from 'uuid';

import { EventHandlerMap, EventSourcedEntityRepository, EventSourcedRootEntity } from '../../infrastructure';
import { ResponseGeneratorKindCreatedOrUpdated } from './response-generator-kind-created-or-updated';
import { ResponseGeneratorKindParameter } from './response-generator-kind-parameter';

const JOURNAL_NAME = 'response-generator-kind/Journal';

type DomainEvents =
  | ResponseGeneratorKindCreatedOrUpdated
  ;

export class ResponseGeneratorKind extends EventSourcedRootEntity<DomainEvents> {
  name = '';
  description = '';
  parameters: ResponseGeneratorKindParameter[] = [];
  generatorFunctionBody = 'return { statusCode: 500, body: \'missing generator function body\' }';

  static create(
    name: string,
    description: string,
    generatorFunctionBody: string,
    parameters: ResponseGeneratorKindParameter[],
  ) {
    return new ResponseGeneratorKind().apply(ResponseGeneratorKindCreatedOrUpdated.create({
      responseGeneratorKindId: `response-generator-kind/${uuid()}`,
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
    parameters: ResponseGeneratorKindParameter[],
  ) {
    return this.apply(ResponseGeneratorKindCreatedOrUpdated.create({
      responseGeneratorKindId: this.id,
      name,
      description,
      generatorFunctionBody,
      parameters,
    }));
  }

  EVENT_HANDLERS: EventHandlerMap<DomainEvents> = {
    [ResponseGeneratorKindCreatedOrUpdated.KIND]: event => {
      this.id = event.responseGeneratorKindId;
      this.name = event.name;
      this.description = event.description;
      this.generatorFunctionBody = event.generatorFunctionBody,
      this.parameters = event.parameters;
    },
  };

  static readonly fromEvents = EventSourcedRootEntity.fromEventsBase<ResponseGeneratorKind, DomainEvents>(ResponseGeneratorKind);
  static readonly ofIdAsync = EventSourcedEntityRepository.entityOfIdAsync(JOURNAL_NAME, ResponseGeneratorKind.fromEvents);
  static readonly saveAsync = EventSourcedEntityRepository.saveAsync<ResponseGeneratorKind, DomainEvents>(JOURNAL_NAME);
  static readonly saveSnapshotAsync = EventSourcedEntityRepository.saveSnapshotAsync<ResponseGeneratorKind, DomainEvents>(JOURNAL_NAME);
}
