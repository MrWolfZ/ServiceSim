import { EventValue } from '../event-journal/event-value';
import { StoredEvent } from '../event-journal/stored-event';

export interface EventJournalPersistenceAdapter {
  getEventCountAsync(journalName: string): Promise<number>;
  persistEventsAsync(journalName: string, events: StoredEvent[]): Promise<void>;
  loadEventsAsync(journalName: string): Promise<StoredEvent[]>;
}

export class InMemoryEventJournalPersistenceAdapter implements EventJournalPersistenceAdapter {
  private eventsPerJournal: { [journalName: string]: StoredEvent[] } = {};

  async getEventCountAsync(journalName: string): Promise<number> {
    return (this.eventsPerJournal[journalName] || []).length;
  }

  async persistEventsAsync(journalName: string, events: StoredEvent[]): Promise<void> {
    this.eventsPerJournal[journalName] = this.eventsPerJournal[journalName] || [];
    events.forEach(e => this.eventsPerJournal[journalName].push(e));
  }

  async loadEventsAsync(journalName: string): Promise<StoredEvent[]> {
    return this.eventsPerJournal[journalName] || [];
  }
}

let adapter: EventJournalPersistenceAdapter = new InMemoryEventJournalPersistenceAdapter();

export function setAdapter(a: EventJournalPersistenceAdapter) {
  adapter = a;
}

export async function persistEventsAsync(
  journalName: string,
  events: EventValue[],
): Promise<void> {
  const eventCount = await adapter.getEventCountAsync(journalName);

  await adapter.persistEventsAsync(
    journalName,
    events.map((ev, idx) => ({ id: eventCount + idx, eventValue: ev })),
  );
}

export async function loadEventsAsync(
  journalName: string,
): Promise<EventValue[]> {
  const storedEvents = await adapter.loadEventsAsync(journalName);
  return storedEvents.map(se => se.eventValue);
}
