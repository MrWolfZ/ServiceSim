import { EventBatch } from './event-batch';
import * as es from './event-stream';
import * as ev from './event-value';

export interface EventJournal {
  name: string;
  store: ev.EventValue[];
}

const eventJournals: { [name: string]: EventJournal } = {};

export function open(
  name: string,
): EventJournal {
  eventJournals[name] = eventJournals[name] || {
    name,
    store: [],
  };

  return eventJournals[name];
}

export function readStream(
  journal: EventJournal,
  streamName: string,
): es.EventStream {
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

export function write(
  journal: EventJournal,
  streamName: string,
  streamVersion: number,
  eventBatch: EventBatch,
) {
  eventBatch.entries.forEach(e => journal.store.push({
    streamName,
    streamVersion,
    body: e.body,
    snapshot: e.snapshot,
  }));
}
