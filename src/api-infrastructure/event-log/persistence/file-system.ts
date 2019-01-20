import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { failure } from '../../../util';
import { EventLogPersistenceAdapter, StoredEvent } from './adapter';

const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const unlink = promisify(fs.unlink);
const rmdir = promisify(fs.rmdir);
const stat = promisify(fs.stat);
const lstat = promisify(fs.lstat);

export async function createFileSystemEventLogPersistenceAdapter(eventsDataDirPath: string): Promise<EventLogPersistenceAdapter> {
  const separator = '$';

  const createEventPath = (event: StoredEvent) => {
    const fileName = `${event.seqNr.toString().padStart(15, '0')}${separator}${event.eventType}${separator}${event.aggregateType || ''}.json`;
    return path.join(eventsDataDirPath, fileName);
  };

  const parseEventFilename = (fileName: string) => {
    const seqNr = parseInt(fileName.substr(0, 15), 10);
    const eventType = fileName.substring(fileName.indexOf(separator) + 1, fileName.lastIndexOf(separator));
    const aggregateType = fileName.substring(fileName.lastIndexOf(separator) + 1, fileName.length - 5);

    return {
      seqNr,
      eventType,
      aggregateType: aggregateType || undefined,
    };
  };

  const readDocument = async (docPath: string) => {
    const fileContent = await readFile(docPath);
    return JSON.parse(fileContent.toString()) as StoredEvent;
  };

  async function getEventCount(): Promise<number> {
    if (!await pathExists(eventsDataDirPath)) {
      return 0;
    }

    const paths = await readdir(eventsDataDirPath);
    return paths.length;
  }

  let currentSeqNr = await getEventCount();

  return {

    async persistEvents(eventsWithoutSeqNr: Omit<StoredEvent, 'seqNr'>[]): Promise<number[]> {
      const events = eventsWithoutSeqNr.map<StoredEvent>(e => {
        currentSeqNr += 1;
        return { ...e, seqNr: currentSeqNr };
      });

      await ensureDirectoryExists(eventsDataDirPath);
      await Promise.all(events.map(event => writeFile(createEventPath(event), JSON.stringify(event, undefined, 2))));
      return events.map(e => e.seqNr);
    },

    async loadEvents(eventTypes: string[], aggregateTypes?: string[], allAfterSeqNr?: number): Promise<StoredEvent[]> {
      if (!await pathExists(eventsDataDirPath)) {
        return [];
      }

      const files = await readdir(eventsDataDirPath);
      return await Promise.all(
        files
          .filter(file => {
            const parsed = parseEventFilename(file);
            return eventTypes.indexOf(parsed.eventType) >= 0 &&
              (!aggregateTypes || aggregateTypes.indexOf(parsed.aggregateType || '') >= 0) &&
              (!allAfterSeqNr || parsed.seqNr > allAfterSeqNr);
          })
          .map(file => path.join(eventsDataDirPath, file))
          .map(readDocument)
      );
    },

    async dropAll() {
      await deleteDir(eventsDataDirPath);
      currentSeqNr = 0;
    },
  };
}

async function ensureDirectoryExists(dirPath: string) {
  if (await pathExists(dirPath)) {
    return;
  }

  await ensureDirectoryExists(path.dirname(dirPath));
  await mkdir(dirPath);
}

async function deleteDir(dirPath: string) {
  if (!dirPath || dirPath === '/') {
    throw failure(`cannot delete dir ${dirPath}`);
  }

  if (!await pathExists(dirPath)) {
    return;
  }

  const names = await readdir(dirPath);

  for (const name of names) {
    const curPath = path.join(dirPath, name);
    const stat = await lstat(curPath);

    if (stat.isDirectory()) {
      await deleteDir(curPath);
    } else {
      await unlink(curPath);
    }
  }

  await rmdir(dirPath);
}

async function pathExists(path: string) {
  try {
    await stat(path);
    return true;
  } catch (err) {
    if (isErrorNotFound(err)) {
      return false;
    }

    throw err;
  }
}

function isErrorNotFound(err: any) {
  return err.code === 'ENOENT';
}
