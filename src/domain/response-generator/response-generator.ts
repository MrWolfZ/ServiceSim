import uuid from 'uuid';

import { EntityEventHandlerMap, EventSourcedEntityRepository, EventSourcedRootEntity } from '../../infrastructure';
import { ResponseGeneratorCreated } from './response-generator-created';

const JOURNAL_NAME = 'response-generator/Journal';

type DomainEvents =
  | ResponseGeneratorCreated
  ;

export class ResponseGenerator extends EventSourcedRootEntity<DomainEvents> {
  responseGeneratorKindId = '';
  properties: { [prop: string]: string | number | boolean } = {};

  static create(
    responseGeneratorKindId: string,
    properties: { [prop: string]: string | number | boolean } = {},
  ) {
    return new ResponseGenerator().apply(ResponseGeneratorCreated.create({
      responseGeneratorId: `response-generator/${uuid()}`,
      responseGeneratorKindId,
      properties,
    }));
  }

  EVENT_HANDLERS: EntityEventHandlerMap<DomainEvents> = {
    [ResponseGeneratorCreated.KIND]: event => {
      this.id = event.responseGeneratorId;
      this.responseGeneratorKindId = event.responseGeneratorKindId;
      this.properties = event.properties;
    },
  };

  getSnapshotValue() {
    return {
      responseGeneratorKindId: this.responseGeneratorKindId,
      properties: this.properties,
    };
  }

  static readonly fromEvents = EventSourcedRootEntity.fromEventsBase<ResponseGenerator, DomainEvents>(ResponseGenerator);
  static readonly ofIdAsync = EventSourcedEntityRepository.entityOfIdAsync(JOURNAL_NAME, ResponseGenerator.fromEvents);
  static readonly saveAsync = EventSourcedEntityRepository.saveAsync<ResponseGenerator, DomainEvents>(JOURNAL_NAME);
  static readonly saveSnapshotAsync = EventSourcedEntityRepository.saveSnapshotAsync<ResponseGenerator, DomainEvents>(JOURNAL_NAME);
}
