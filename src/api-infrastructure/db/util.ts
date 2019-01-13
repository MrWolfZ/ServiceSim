import { Aggregate, AggregateMetadata, DomainEvent, EventDrivenAggregateMetadata, VersionedAggregateMetadata } from '../api-infrastructure.types';

import { assertNever } from '../../util';

export function getMetadataOfType<TAggregate extends Aggregate<TAggregate['@type']>, TEvent extends DomainEvent<TAggregate['@type'], TEvent['eventType']>>(
  metadataType: 'Default' | 'Versioned' | 'EventDriven',
  $aggregateMetadata: AggregateMetadata<TAggregate['@type']>,
  $versionedMetadata: VersionedAggregateMetadata<TAggregate>,
  $eventDrivenMetadata: EventDrivenAggregateMetadata<TAggregate, TEvent>,
): AggregateMetadata<TAggregate['@type']>
  | VersionedAggregateMetadata<TAggregate>
  | EventDrivenAggregateMetadata<TAggregate, TEvent> {
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
