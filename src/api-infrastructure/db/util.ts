import { DomainEvent, EventDrivenRootEntityMetadata, RootEntity, RootEntityMetadata, VersionedRootEntityMetadata } from '../api-infrastructure.types';

import { assertNever } from '../../util/assert';

export function getMetadataOfType<TEntityType extends string, TEntity extends RootEntity, TEvent extends DomainEvent<TEntityType, TEvent['eventType']>>(
  metadataType: 'Default' | 'Versioned' | 'EventDriven',
  $rootEntityMetadata: RootEntityMetadata<TEntityType>,
  $versionedRootEntityMetadata: VersionedRootEntityMetadata<TEntityType, TEntity>,
  $eventDrivenRootEntityMetadata: EventDrivenRootEntityMetadata<TEntityType, TEntity, TEvent>,
): RootEntityMetadata<TEntityType> | VersionedRootEntityMetadata<TEntityType, TEntity> | EventDrivenRootEntityMetadata<TEntityType, TEntity, TEvent> {
  switch (metadataType) {
    case 'Default':
      return $rootEntityMetadata;

    case 'Versioned':
      return $versionedRootEntityMetadata;

    case 'EventDriven':
      return $eventDrivenRootEntityMetadata;

    default:
      return assertNever(metadataType);
  }
}
