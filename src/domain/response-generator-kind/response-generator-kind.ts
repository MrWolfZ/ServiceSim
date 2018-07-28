import uuid from 'uuid';

import { EventHandlerMap, EventSourcedEntityRepository, EventSourcedRootEntity } from '../../infrastructure';
import { ResponseGeneratorKindCreated } from './response-generator-kind-created';

const JOURNAL_NAME = 'response-generator-kind/Journal';

type DomainEvents =
  | ResponseGeneratorKindCreated
  ;

export interface ResponseGeneratorParameter {
  name: string;
  description: string;
  isRequired: boolean;
  valueType: 'string' | 'boolean' | 'number';
}

export class ResponseGeneratorKind extends EventSourcedRootEntity<DomainEvents> {
  name = '';
  description = '';
  parameters: ResponseGeneratorParameter[] = [];
  generatorFunctionBody = 'return { statusCode: 500, body: \'missing generator function body\' }';

  static create(
    name: string,
    description: string,
    generatorFunctionBody: string,
  ) {
    return new ResponseGeneratorKind().apply(ResponseGeneratorKindCreated.create({
      responseGeneratorKindId: `response-generator-kind/${uuid()}`,
      name,
      description,
      generatorFunctionBody,
    }));
  }

  EVENT_HANDLERS: EventHandlerMap<DomainEvents> = {
    [ResponseGeneratorKindCreated.KIND]: event => {
      this.id = event.responseGeneratorKindId;
      this.name = event.name;
      this.description = event.description;
    },
  };

  static readonly fromEvents = EventSourcedRootEntity.fromEventsBase<ResponseGeneratorKind, DomainEvents>(ResponseGeneratorKind);
  static readonly ofIdAsync = EventSourcedEntityRepository.entityOfIdAsync(JOURNAL_NAME, ResponseGeneratorKind.fromEvents);
  static readonly saveAsync = EventSourcedEntityRepository.saveAsync<ResponseGeneratorKind, DomainEvents>(JOURNAL_NAME);
  static readonly saveSnapshotAsync = EventSourcedEntityRepository.saveSnapshotAsync<ResponseGeneratorKind, DomainEvents>(JOURNAL_NAME);
}
