import { Aggregate, AggregateMetadata, DomainEvent, EventDrivenAggregateMetadata, VersionedAggregateMetadata } from '../api-infrastructure.types';

import { assertNever } from '../../util/assert';

export function getMetadataOfType<TAggregateType extends string, TAggregate extends Aggregate, TEvent extends DomainEvent<TAggregateType, TEvent['eventType']>>(
  metadataType: 'Default' | 'Versioned' | 'EventDriven',
  $aggregateMetadata: AggregateMetadata<TAggregateType>,
  $versionedMetadata: VersionedAggregateMetadata<TAggregateType, TAggregate>,
  $eventDrivenMetadata: EventDrivenAggregateMetadata<TAggregateType, TAggregate, TEvent>,
): AggregateMetadata<TAggregateType>
  | VersionedAggregateMetadata<TAggregateType, TAggregate>
  | EventDrivenAggregateMetadata<TAggregateType, TAggregate, TEvent> {
  switch (metadataType) {
    case 'Default':
      return $aggregateMetadata;

    case 'Versioned':
      return $versionedMetadata;

    case 'EventDriven':
      return $eventDrivenMetadata;

    default:
      return assertNever(metadataType);
  }
}
