import { StoredEvent } from './stored-event';

// TODO: find a proper way to deal with the event IDs
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
    const eventCount = await this.getEventCountAsync(journalName);
    this.eventsPerJournal[journalName] = this.eventsPerJournal[journalName] || [];
    events.map((e, idx) => ({ ...e, id: eventCount + idx })).forEach(e => this.eventsPerJournal[journalName].push(e));
  }

  async loadEventsAsync(journalName: string): Promise<StoredEvent[]> {
    return this.eventsPerJournal[journalName] || [];
  }
}

let adapter: EventJournalPersistenceAdapter = new InMemoryEventJournalPersistenceAdapter();

export function setAdapter(a: EventJournalPersistenceAdapter) {
  adapter = a;
}

export function persistEventsAsync(
  journalName: string,
  events: StoredEvent[],
): Promise<void> {
  return adapter.persistEventsAsync(
    journalName,
    events,
  );
}

export function loadEventsAsync(
  journalName: string,
): Promise<StoredEvent[]> {
  return adapter.loadEventsAsync(journalName);
}
