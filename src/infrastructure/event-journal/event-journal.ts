import { DomainEvent } from '../domain-event';
import * as es from './event-stream';
import { loadEventsAsync, persistEventsAsync } from './persistence';
import * as se from './stored-event';

export interface EventJournal {
  name: string;
  store: se.StoredEvent[];
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
  let values: se.StoredEvent[] = [];
  let latestSnapshotValue: se.StoredEvent | undefined;

  journal.store
    .filter(value => value.streamName === streamName)
    .forEach(value => {
      if (se.hasSnapshot(value)) {
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
  ...events: DomainEvent[]
): Promise<void> {
  const storedEvents: se.StoredEvent[] = events.map(ev => {
    const eventBody = JSON.stringify(ev);
    return {
      id: 0,
      streamName,
      streamVersion,
      body: eventBody,
      snapshot: '',
    };
  });

  storedEvents.forEach(e => journal.store.push(e));

  await persistEventsAsync(journal.name, storedEvents);
}

// TODO: is this the proper way of doing this? shouldn't we save the
// snapshot separately so that we can load it directly instead of
// loading it from the event stream?
export async function writeSnapshotAsync(
  journal: EventJournal,
  streamName: string,
  streamVersion: number,
  snapshotValue: any,
): Promise<void> {
  const serializedSnapshotValue = JSON.stringify(snapshotValue);
  const storedEvent: se.StoredEvent = {
    id: 0,
    streamName,
    streamVersion,
    body: '',
    snapshot: serializedSnapshotValue,
  };

  journal.store.push(storedEvent);

  await persistEventsAsync(journal.name, [storedEvent]);
}
