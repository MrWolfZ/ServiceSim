import { DomainEvent } from './domain-event';
import * as ej from './event-journal/event-journal';
import * as es from './event-journal/event-stream';
import * as el from './event-log/event-log';
import { EntityEventHandler, EventSourcedRootEntity } from './event-sourced-root-entity';

const journals = new Map<string, ej.EventJournal>();

async function ensureJournalAsync(journalName: string): Promise<ej.EventJournal> {
  if (!journals.has(journalName)) {
    journals.set(journalName, await ej.openAsync(journalName));
  }

  return journals.get(journalName)!;
}

export const entityOfIdAsync = <T extends EventSourcedRootEntity<TEvent>, TEvent extends DomainEvent>(
  journalName: string,
  apply: EntityEventHandler<T, TEvent>,
  createFromEvents: (stream: TEvent[], streamVersion: number) => T,
) => async (
  id: string,
  ): Promise<T> => {
    const stream = await ej.readStreamAsync(await ensureJournalAsync(journalName), id);
    const events = stream.stream.map(e => JSON.parse(e.body) as TEvent);

    if (es.hasSnapshot(stream)) {
      const entity = JSON.parse(stream.snapshot) as T;
      return events.reduce(apply, entity);
    } else {
      return createFromEvents(
        events,
        stream.streamVersion,
      );
    }
  };

export const saveAsync = <T extends EventSourcedRootEntity<TEvent>, TEvent extends DomainEvent>(
  journalName: string,
) => async (
  entity: T,
  ): Promise<T> => {
    await ej.writeAsync(
      await ensureJournalAsync(journalName),
      entity.id,
      entity.mutatedVersion,
      ...entity.mutatingEvents
    );

    await el.publishAsync(...entity.mutatingEvents);

    return {
      ...(entity as any),
      mutatingEvents: [],
      unmutatedVersion: entity.mutatedVersion,
      mutatedVersion: entity.mutatedVersion + 1,
    };
  };

export const saveSnapshotAsync = <T extends EventSourcedRootEntity<TEvent>, TEvent extends DomainEvent>(
  journalName: string,
) => async (
  entity: T,
  ) => {
    const snapshotValue: T = {
      ...(entity as any),
      mutatingEvents: [],
      unmutatedVersion: entity.mutatedVersion,
      mutatedVersion: entity.mutatedVersion + 1,
    };

    await ej.writeSnapshotAsync(
      await ensureJournalAsync(journalName),
      entity.id,
      entity.mutatedVersion,
      snapshotValue,
    );
  };
