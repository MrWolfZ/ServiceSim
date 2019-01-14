import { failure, keys } from '../../util';
import { Aggregate, AggregateMetadata, DomainEvent, EventDrivenAggregateMetadata, VersionedAggregateMetadata } from '../api-infrastructure.types';
import { DocumentCollection } from './persistence/adapter';

export type AggregateWithMetadata<TAggregate, TMetadata> = TAggregate & { $metadata: TMetadata };

export interface QueryOperations<
  TAggregate extends Aggregate<TAggregate['@type']>,
  TMetadata extends AggregateMetadata<TAggregate['@type']>,
  > {
  byId(id: string): Promise<AggregateWithMetadata<TAggregate, TMetadata>>;
  all(): Promise<AggregateWithMetadata<TAggregate, TMetadata>[]>;
  byProperties(props: Partial<TAggregate>): Promise<AggregateWithMetadata<TAggregate, TMetadata>[]>;
}

export interface VersionQueryOperations<
  TAggregate extends Aggregate<TAggregate['@type']>,
  TMetadata extends VersionedAggregateMetadata<TAggregate>,
  > extends QueryOperations<TAggregate, TMetadata> {
  byIdAndVersion(id: string, version: number): Promise<AggregateWithMetadata<TAggregate, TMetadata>>;
}

export default function query<TAggregate extends Aggregate<TAggregate['@type']>>(
  aggregateType: TAggregate['@type'],
  metadataType: 'Default',
  collectionFactory: () => DocumentCollection<TAggregate & { $metadata: any }>,
): QueryOperations<TAggregate, AggregateMetadata<TAggregate['@type']>>;

export default function query<TAggregate extends Aggregate<TAggregate['@type']>>(
  aggregateType: TAggregate['@type'],
  metadataType: 'Versioned',
  collectionFactory: () => DocumentCollection<TAggregate & { $metadata: any }>,
): VersionQueryOperations<TAggregate, VersionedAggregateMetadata<TAggregate>>;

export default function query<TAggregate extends Aggregate<TAggregate['@type']>, TEvent extends DomainEvent<TAggregate['@type'], TEvent['eventType']>>(
  aggregateType: TAggregate['@type'],
  metadataType: 'EventDriven',
  collectionFactory: () => DocumentCollection<TAggregate & { $metadata: any }>,
): VersionQueryOperations<TAggregate, EventDrivenAggregateMetadata<TAggregate, TEvent>>;

export default function query<TAggregate extends Aggregate<TAggregate['@type']>, TEvent extends DomainEvent<TAggregate['@type'], TEvent['eventType']>>(
  aggregateType: TAggregate['@type'],
  _: 'Default' | 'Versioned' | 'EventDriven',
  collectionFactory: () => DocumentCollection<TAggregate & { $metadata: any }>,
): VersionQueryOperations<TAggregate, any> {
  return {
    async byId(id) {
      const col = collectionFactory();

      const latestAggregate = await col.getLatestVersionById(id);

      if (!latestAggregate) {
        throw failure(`byIdAsync failed: aggregate with id ${id} of type ${aggregateType} does not exist`);
      }

      if ((latestAggregate.$metadata as VersionedAggregateMetadata<TAggregate>).isDeleted) {
        throw failure(`byIdAsync failed: aggregate with id ${id} of type ${aggregateType} is deleted`);
      }

      return latestAggregate;
    },

    async byIdAndVersion(id, version) {
      const col = collectionFactory();

      const aggregate = await col.getByIdAndVersion(id, version);

      if (!aggregate) {
        const latestAggregate = await col.getLatestVersionById(id);

        if (!latestAggregate) {
          throw failure(`byIdAndVersionAsync failed: aggregate with id ${id} of type ${aggregateType} does not exist`);
        }

        throw failure(`byIdAndVersionAsync failed: aggregate with id ${id} of type ${aggregateType} does not have version ${version}`);
      }

      if ((aggregate.$metadata as VersionedAggregateMetadata<TAggregate>).isDeleted) {
        throw failure(`byIdAndVersionAsync failed: aggregate with id ${id} of type ${aggregateType} is deleted`);
      }

      return aggregate;
    },

    async all() {
      const col = collectionFactory();

      return (await col.getAll())
        .filter(e => !(e.$metadata as VersionedAggregateMetadata<TAggregate>).isDeleted);
    },

    async byProperties(props) {
      const col = collectionFactory();

      const propNames = keys(props);
      return (await col.getAll())
        .filter(e => !(e.$metadata as VersionedAggregateMetadata<TAggregate>).isDeleted)
        .filter(e => propNames.every(p => e[p] === props[p]));
    },
  };
}
