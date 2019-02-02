import { Aggregate, AggregateMetadata, AggregateWithMetadata, DomainEvent } from 'src/domain/infrastructure/ddd';
import { failure, keys } from 'src/util';
import { DocumentCollection } from './persistence';

export interface QueryOperations<
  TAggregate extends Aggregate<TAggregate['@type']>,
  > {
  byId(id: string): Promise<AggregateWithMetadata<TAggregate>>;
  all(): Promise<AggregateWithMetadata<TAggregate>[]>;
  byProperties(props: Partial<TAggregate>): Promise<AggregateWithMetadata<TAggregate>[]>;
}

export interface VersionQueryOperations<
  TAggregate extends Aggregate<TAggregate['@type']>,
  > extends QueryOperations<TAggregate> {
  byIdAndVersion(id: string, version: number): Promise<AggregateWithMetadata<TAggregate>>;
}

export default function query<TAggregate extends Aggregate<TAggregate['@type']>, TEvent extends DomainEvent<TAggregate['@type'], TEvent['eventType']>>(
  aggregateType: TAggregate['@type'],
  collectionFactory: () => DocumentCollection<TAggregate & { $metadata: AggregateMetadata<TAggregate> }>,
): VersionQueryOperations<TAggregate> {
  return {
    async byId(id) {
      const col = collectionFactory();

      const latestAggregate = await col.getLatestVersionById(id);

      if (!latestAggregate) {
        throw failure(`byIdAsync failed: aggregate with id ${id} of type ${aggregateType} does not exist`);
      }

      if (latestAggregate.$metadata.isDeleted) {
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

      if (aggregate.$metadata.isDeleted) {
        throw failure(`byIdAndVersionAsync failed: aggregate with id ${id} of type ${aggregateType} is deleted`);
      }

      return aggregate;
    },

    async all() {
      const col = collectionFactory();

      return (await col.getAll())
        .filter(e => !e.$metadata.isDeleted);
    },

    async byProperties(props) {
      const col = collectionFactory();

      const propNames = keys(props);
      return (await col.getAll())
        .filter(e => !e.$metadata.isDeleted)
        .filter(e => propNames.every(p => e[p] === props[p]));
    },
  };
}
