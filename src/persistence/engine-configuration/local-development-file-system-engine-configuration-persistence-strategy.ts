import fs from 'fs';
import lodash from 'lodash';
import path from 'path';
import { EngineConfigurationAggregate } from 'src/domain/engine-configuration';
import { EngineConfigurationPersistenceStrategy } from 'src/infrastructure/persistence/engine-configuration/engine-configuration-persistence-strategy';
import { failure } from 'src/util';
import { generateId } from 'src/util/id';
import { promisify } from 'util';
import { deleteDir, deleteFile, ensureDirectoryExists, pathExists } from '../file-system-util';

const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);
const writeFile = promisify(fs.writeFile);

type Aggregate<T extends string> = EngineConfigurationAggregate<T>;

// TODO: handle race conditions, cache lots of things in memory and be smarter about fetching documents
// TODO: watch file system and expose API to notify about updated aggregates
export async function createLocalDevelopmentFileSystemEngineConfigurationPersistenceStrategyBaseDataDir(
  baseDataDirPath: string,
): Promise<EngineConfigurationPersistenceStrategy> {
  if (!baseDataDirPath) {
    throw failure('base data dir must be set');
  }

  if (!(await pathExists(baseDataDirPath))) {
    throw failure(`data dir does not exist: ${baseDataDirPath}`);
  }

  const dataDirPath = path.join(baseDataDirPath, 'engine-configuration');

  await ensureDirectoryExists(dataDirPath);

  const formatName = (name: string) => lodash.kebabCase(name);
  const collectionDirPath = (aggregateType: string) => path.join(dataDirPath, formatName(aggregateType));
  const fileNameForName = (name: string) => `${formatName(name)}.json`;
  const documentPath = (aggregateType: string, name: string) => path.join(collectionDirPath(aggregateType), fileNameForName(name));

  async function readDocument<TAggregate extends Aggregate<TAggregate['@type']>>(docPath: string) {
    const fileContent = await readFile(docPath);
    return JSON.parse(fileContent.toString()) as TAggregate;
  }

  async function readAllAggregates<TAggregate extends Aggregate<TAggregate['@type']>>(aggregateType: TAggregate['@type']) {
    const colDirPath = collectionDirPath(aggregateType);

    if (!(await pathExists(colDirPath))) {
      return [];
    }

    const fileNames = await readdir(colDirPath);
    const allAggregates = await Promise.all(fileNames.map(n => path.join(colDirPath, n)).map(readDocument));
    return allAggregates as TAggregate[];
  }

  async function readAggregateById<TAggregate extends Aggregate<TAggregate['@type']>>(aggregateType: TAggregate['@type'], id: string) {
    const allAggregates = await readAllAggregates(aggregateType);
    return allAggregates.find(a => a.id === id);
  }

  return {
    async generateId<TAggregate extends Aggregate<TAggregate['@type']>>(_: TAggregate['@type']): Promise<string> {
      return generateId();
    },

    async upsertAggregate<TAggregate extends Aggregate<TAggregate['@type']>>(aggregate: TAggregate): Promise<void> {
      const aggregateType = aggregate['@type'];
      const id = aggregate.id;
      const storedAggregate = await readAggregateById(aggregateType, id);

      if (storedAggregate && storedAggregate.name !== aggregate.name) {
        await deleteFile(documentPath(aggregateType, storedAggregate.name));
      }

      await ensureDirectoryExists(collectionDirPath(aggregateType));
      await writeFile(documentPath(aggregateType, aggregate.name), JSON.stringify(aggregate, undefined, 2));
    },

    async deleteAggregate<TAggregate extends Aggregate<TAggregate['@type']>>(aggregateType: TAggregate['@type'], id: string): Promise<void> {
      const aggregate = await readAggregateById(aggregateType, id);

      if (!aggregate) {
        throw failure(`aggregate of type ${aggregateType} with id ${id} cannot be deleted since it does not exist`);
      }

      await deleteFile(documentPath(aggregateType, aggregate.name));
    },

    async getAllAggregates<TAggregate extends Aggregate<TAggregate['@type']>>(aggregateType: TAggregate['@type']): Promise<TAggregate[]> {
      return await readAllAggregates(aggregateType);
    },

    async getAggregateById<TAggregate extends Aggregate<TAggregate['@type']>>(aggregateType: TAggregate['@type'], id: string): Promise<TAggregate | undefined> {
      return await readAggregateById(aggregateType, id);
    },

    async deleteAllData(): Promise<void> {
      await deleteDir(dataDirPath);
      await ensureDirectoryExists(dataDirPath);
    },
  };
}
