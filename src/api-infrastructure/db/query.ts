import { failure } from '../../util/result-monad';
import { keys } from '../../util/util';
import { Aggregate, AggregateMetadata, DomainEvent, EventDrivenAggregateMetadata, VersionedAggregateMetadata } from '../api-infrastructure.types';

export type AggregateWithMetadata<TAggregate, TMetadata> = TAggregate & { $metadata: TMetadata };

export interface QueryOperations<TAggregateType extends string, TAggregate extends Aggregate, TMetadata extends AggregateMetadata<TAggregateType>> {
  byId(id: string): Promise<AggregateWithMetadata<TAggregate, TMetadata>>;
  all(): Promise<AggregateWithMetadata<TAggregate, TMetadata>[]>;
  byProperties(props: Partial<TAggregate>): Promise<AggregateWithMetadata<TAggregate, TMetadata>[]>;
}

export interface VersionQueryOperations<
  TAggregateType extends string,
  TAggregate extends Aggregate,
  TMetadata extends VersionedAggregateMetadata<TAggregateType, TAggregate>,
  > extends QueryOperations<TAggregateType, TAggregate, TMetadata> {
  byIdAndVersion(id: string, version: number): Promise<AggregateWithMetadata<TAggregate, TMetadata>>;
}

export default function query<TAggregateType extends string, TAggregate extends Aggregate>(
  aggregateType: TAggregateType,
  metadataType: 'Default',
  getAggregateCollection: <TAggregate>(aggregateType: string) => { [id: string]: (TAggregate & { $metadata: any })[] },
): QueryOperations<TAggregateType, TAggregate, AggregateMetadata<TAggregateType>>;

export default function query<TAggregateType extends string, TAggregate extends Aggregate>(
  aggregateType: TAggregateType,
  metadataType: 'Versioned',
  getAggregateCollection: <TAggregate>(aggregateType: string) => { [id: string]: (TAggregate & { $metadata: any })[] },
): VersionQueryOperations<TAggregateType, TAggregate, VersionedAggregateMetadata<TAggregateType, TAggregate>>;

export default function query<TAggregateType extends string, TAggregate extends Aggregate, TEvent extends DomainEvent<TAggregateType, TEvent['eventType']>>(
  aggregateType: TAggregateType,
  metadataType: 'EventDriven',
  getAggregateCollection: <TAggregate>(aggregateType: string) => { [id: string]: (TAggregate & { $metadata: any })[] },
): VersionQueryOperations<TAggregateType, TAggregate, EventDrivenAggregateMetadata<TAggregateType, TAggregate, TEvent>>;

export default function query<TAggregateType extends string, TAggregate extends Aggregate, TEvent extends DomainEvent<TAggregateType, TEvent['eventType']>>(
  aggregateType: TAggregateType,
  _: 'Default' | 'Versioned' | 'EventDriven',
  getAggregateCollection: <TAggregate>(aggregateType: string) => { [id: string]: (TAggregate & { $metadata: any })[] },
): VersionQueryOperations<TAggregateType, TAggregate, any> {
  return {
    async byId(id) {
      const col = getAggregateCollection<TAggregate>(aggregateType);

      if (!col[id] || col[id].length === 0) {
        throw failure(`byIdAsync failed: aggregate with id ${id} of type ${aggregateType} does not exist`);
      }

      const latestAggregate = col[id][col[id].length - 1];

      if ((latestAggregate.$metadata as VersionedAggregateMetadata<TAggregateType, TAggregate>).isDeleted) {
        throw failure(`byIdAsync failed: aggregate with id ${id} of type ${aggregateType} is deleted`);
      }

      return latestAggregate;
    },

    async byIdAndVersion(id, version) {
      const col = getAggregateCollection<any>(aggregateType);

      if (!col[id] || col[id].length === 0) {
        throw failure(`byIdAndVersionAsync failed: aggregate with id ${id} of type ${aggregateType} does not exist`);
      }

      const aggregate = col[id].find(e => (e.$metadata as VersionedAggregateMetadata<TAggregateType, TAggregate>).version === version);

      if (!aggregate) {
        throw failure(`byIdAndVersionAsync failed: aggregate with id ${id} of type ${aggregateType} does not have version ${version}`);
      }

      if ((aggregate.$metadata as VersionedAggregateMetadata<TAggregateType, TAggregate>).isDeleted) {
        throw failure(`byIdAndVersionAsync failed: aggregate with id ${id} of type ${aggregateType} is deleted`);
      }

      return aggregate;
    },

    async all() {
      const col = getAggregateCollection<any>(aggregateType);
      return keys(col)
        .map(k => col[k])
        .filter(entities => entities.length > 0)
        .map(entities => entities[entities.length - 1])
        .filter(e => !(e.$metadata as VersionedAggregateMetadata<TAggregateType, TAggregate>).isDeleted);
    },

    async byProperties(props) {
      const col = getAggregateCollection<any>(aggregateType);
      const propNames = keys(props);
      return keys(col)
        .map(k => col[k])
        .filter(entities => entities.length > 0)
        .map(entities => entities[entities.length - 1])
        .filter(e => !(e.$metadata as VersionedAggregateMetadata<TAggregateType, TAggregate>).isDeleted)
        .filter(e => propNames.every(p => e[p] === props[p]));
    },
  };
}
