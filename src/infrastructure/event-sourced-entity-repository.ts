import { DomainEvent } from './domain-event';
import * as ej from './event-journal/event-journal';
import * as es from './event-journal/event-stream';
import { EventLog } from './event-log';
import { EventSourcedRootEntity } from './event-sourced-root-entity';

const journals = new Map<string, ej.EventJournal>();

async function ensureJournalAsync(journalName: string): Promise<ej.EventJournal> {
  if (!journals.has(journalName)) {
    journals.set(journalName, await ej.openAsync(journalName));
  }

  return journals.get(journalName)!;
}

export class EventSourcedEntityRepository {
  static entityOfIdAsync<T extends EventSourcedRootEntity<TEvent>, TEvent extends DomainEvent>(
    journalName: string,
    fromEvents: (events: TEvent[], streamVersion: number, snapshot: any | undefined) => T,
  ) {
    return async (
      id: string,
    ): Promise<T> => {
      const stream = await ej.readStreamAsync(await ensureJournalAsync(journalName), id);
      const events = stream.stream.map(e => JSON.parse(e.body) as TEvent);

      return fromEvents(
        events,
        stream.streamVersion,
        es.hasSnapshot(stream) ? JSON.parse(stream.snapshot) : undefined,
      );
    };
  }

  static saveAsync<T extends EventSourcedRootEntity<TEvent>, TEvent extends DomainEvent>(
    journalName: string,
  ) {
    return async (
      entity: T,
    ): Promise<T> => {
      await ej.writeAsync(
        await ensureJournalAsync(journalName),
        entity.id,
        entity.mutatedVersion,
        ...entity.mutatingEvents
      );

      await EventLog.publishAsync(...entity.mutatingEvents);

      entity.mutatingEvents = [];
      entity.unmutatedVersion = entity.mutatedVersion;
      entity.mutatedVersion = entity.mutatedVersion + 1;

      return entity;
    };
  }

  static saveSnapshotAsync<T extends EventSourcedRootEntity<TEvent>, TEvent extends DomainEvent>(
    journalName: string,
  ) {
    return async (
      entity: T,
    ) => {
      const snapshotValue = entity.createSnapshot();

      await ej.writeSnapshotAsync(
        await ensureJournalAsync(journalName),
        entity.id,
        entity.unmutatedVersion,
        snapshotValue,
      );

      return entity;
    };
  }
}
