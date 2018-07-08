import { EventBatch } from './event-batch';
import * as es from './event-stream';
import * as ev from './event-value';
import { loadEventsAsync, persistEventsAsync } from './persistence/persistence';

export interface EventJournal {
  name: string;
  store: ev.EventValue[];
}

export async function openAsync(
  name: string,
): Promise<EventJournal> {
  return {
    name,
    store: await loadEventsAsync(name),
  };
}

export async function readStreamAsync(
  journal: EventJournal,
  streamName: string,
): Promise<es.EventStream> {
  let values: ev.EventValue[] = [];
  let latestSnapshotValue: ev.EventValue | undefined;

  journal.store
    .filter(value => value.streamName === streamName)
    .forEach(value => {
      if (ev.hasSnapshot(value)) {
        values = [];
        latestSnapshotValue = value;
      } else {
        values.push(value);
      }
    });

  const snapshotVersion = !latestSnapshotValue ? 0 : latestSnapshotValue.streamVersion;
  const streamVersion = values.length === 0 ? snapshotVersion : values[values.length - 1].streamVersion;

  return {
    streamName,
    streamVersion,
    stream: values,
    snapshot: !latestSnapshotValue ? '' : latestSnapshotValue.snapshot,
  };
}

export async function writeAsync(
  journal: EventJournal,
  streamName: string,
  streamVersion: number,
  eventBatch: EventBatch,
): Promise<void> {
  eventBatch.entries.forEach(e => journal.store.push({
    streamName,
    streamVersion,
    body: e.body,
    snapshot: e.snapshot,
  }));

  await persistEventsAsync(journal.name, journal.store);
}
