import { EventLogPersistenceAdapter, StoredEvent } from './adapter';

export class InMemoryEventLogPersistenceAdapter implements EventLogPersistenceAdapter {
  private events: StoredEvent[] = [];

  async getEventCount(): Promise<number> {
    return this.events.length;
  }

  async persistEvents(...events: StoredEvent[]): Promise<void> {
    events.forEach(e => this.events.push(e));
  }

  async loadEvents(...eventTypes: string[]): Promise<StoredEvent[]> {
    return this.events.filter(e => eventTypes.indexOf(e.eventType) >= 0);
  }
}
