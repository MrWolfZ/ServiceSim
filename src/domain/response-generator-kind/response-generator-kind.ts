import uuid from 'uuid';

import { EventHandlerMap, EventSourcedEntityRepository, EventSourcedRootEntity } from '../../infrastructure';
import { ResponseGeneratorPropertyDescriptorAdded } from './property-descriptor-added';
import { ResponseGeneratorKindCreated } from './response-generator-kind-created';

const JOURNAL_NAME = 'response-generator-kind/Journal';

type DomainEvents =
  | ResponseGeneratorKindCreated
  | ResponseGeneratorPropertyDescriptorAdded
  ;

export interface ResponseGeneratorPropertyDescriptor {
  name: string;
  description: string;
  isRequired: boolean;
  valueType: 'string' | 'boolean' | 'number';
}

export class ResponseGeneratorKind extends EventSourcedRootEntity<DomainEvents> {
  name = '';
  description = '';
  propertyDescriptors: ResponseGeneratorPropertyDescriptor[] = [];
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

  addPropertyDescriptor = (
    name: string,
    description: string,
    isRequired: boolean,
    valueType: 'string' | 'boolean' | 'number',
  ) => {
    return this.apply(ResponseGeneratorPropertyDescriptorAdded.create({
      responseGeneratorKindId: this.id,
      name,
      description,
      isRequired,
      valueType,
    }));
  }

  EVENT_HANDLERS: EventHandlerMap<DomainEvents> = {
    [ResponseGeneratorKindCreated.KIND]: event => {
      this.id = event.responseGeneratorKindId;
      this.name = event.name;
      this.description = event.description;
    },
    [ResponseGeneratorPropertyDescriptorAdded.KIND]: event => {
      this.propertyDescriptors.push({
        name: event.name,
        description: event.description,
        isRequired: event.isRequired,
        valueType: event.valueType,
      });
    },
  };

  static readonly fromEvents = EventSourcedRootEntity.fromEventsBase<ResponseGeneratorKind, DomainEvents>(ResponseGeneratorKind);
  static readonly ofIdAsync = EventSourcedEntityRepository.entityOfIdAsync(JOURNAL_NAME, ResponseGeneratorKind.fromEvents);
  static readonly saveAsync = EventSourcedEntityRepository.saveAsync<ResponseGeneratorKind, DomainEvents>(JOURNAL_NAME);
  static readonly saveSnapshotAsync = EventSourcedEntityRepository.saveSnapshotAsync<ResponseGeneratorKind, DomainEvents>(JOURNAL_NAME);
}
