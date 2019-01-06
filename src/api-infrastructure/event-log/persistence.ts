import { DomainEvent } from '../api-infrastructure.types';
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

// TODO: fix event index mess
export async function persistEventsAsync(
  events: DomainEvent<any, any>[],
): Promise<number[]> {
  const eventCount = await adapter.getEventCountAsync();

  await adapter.persistEventsAsync(
    events.map((ev, idx) => ({
      id: eventCount + idx + 1,
      eventKind: ev.eventType,
      body: JSON.stringify(ev),
    })),
  );

  return events.map((_, idx) => eventCount + idx + 1);
}

export async function loadEventsAsync<TEvent extends DomainEvent<any, any> = DomainEvent<any, any>>(
  ...eventKinds: string[]
): Promise<[TEvent[], number]> {
  const storedEvents = await adapter.loadEventsAsync(...eventKinds);
  return [storedEvents.map(se => JSON.parse(se.body)), storedEvents.reduce((l, ev) => Math.max(l, ev.id), 0)];
}
