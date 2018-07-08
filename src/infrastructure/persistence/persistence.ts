import { EventValue } from '../event-value';
import { StoredEvent } from '../stored-event';

export interface PersistenceAdapter {
  persistEventsAsync(journalName: string, events: StoredEvent[]): Promise<void>;
  loadEventsAsync(journalName: string): Promise<StoredEvent[]>;
}

export class InMemoryPersistenceAdapter implements PersistenceAdapter {
  private eventsPerJournal: { [journalName: string]: StoredEvent[] } = {};

  async persistEventsAsync(journalName: string, events: StoredEvent[]): Promise<void> {
    this.eventsPerJournal[journalName] = events;
  }

  async loadEventsAsync(journalName: string): Promise<StoredEvent[]> {
    return this.eventsPerJournal[journalName] || [];
  }
}

let adapter: PersistenceAdapter = new InMemoryPersistenceAdapter();

export function setAdapter(a: PersistenceAdapter) {
  adapter = a;
}

export async function persistEventsAsync(
  journalName: string,
  events: EventValue[],
): Promise<void> {
  await adapter.persistEventsAsync(
    journalName,
    events.map((ev, idx) => ({ id: idx, eventValue: ev })),
  );
}

export async function loadEventsAsync(
  journalName: string,
): Promise<EventValue[]> {
  const storedEvents = await adapter.loadEventsAsync(journalName);
  return storedEvents.map(se => se.eventValue);
}
