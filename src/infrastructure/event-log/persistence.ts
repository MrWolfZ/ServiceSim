import { DomainEvent } from '../domain-event';
import { StoredEvent } from './stored-event';

export interface EventLogPersistenceAdapter {
  getEventCountAsync(): Promise<number>;
  persistEventsAsync(events: StoredEvent[]): Promise<void>;
  loadEventsAsync(...eventKinds: string[]): Promise<StoredEvent[]>;
}

export class InMemoryEventLogPersistenceAdapter implements EventLogPersistenceAdapter {
  private events: StoredEvent[] = [];

  async getEventCountAsync(): Promise<number> {
    return this.events.length;
  }

  async persistEventsAsync(events: StoredEvent[]): Promise<void> {
    events.forEach(e => this.events.push(e));
  }

  async loadEventsAsync(...eventKinds: string[]): Promise<StoredEvent[]> {
    return this.events.filter(e => eventKinds.indexOf(e.eventKind) >= 0);
  }
}

let adapter: EventLogPersistenceAdapter = new InMemoryEventLogPersistenceAdapter();

export function setAdapter(a: EventLogPersistenceAdapter) {
  adapter = a;
}

export async function persistEventsAsync(
  events: DomainEvent[],
): Promise<void> {
  const eventCount = await adapter.getEventCountAsync();

  await adapter.persistEventsAsync(
    events.map((ev, idx) => ({
      id: eventCount + idx,
      eventKind: ev.kind,
      body: JSON.stringify(ev),
    })),
  );
}

export async function loadEventsAsync<TEvent extends DomainEvent = DomainEvent>(
  ...eventKinds: string[]
): Promise<TEvent[]> {
  const storedEvents = await adapter.loadEventsAsync(...eventKinds);
  return storedEvents.map(se => JSON.parse(se.body));
}
