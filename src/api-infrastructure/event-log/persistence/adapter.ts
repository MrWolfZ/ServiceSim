export interface StoredEvent {
  id: number;
  eventType: string;
  body: string;
}

export interface EventLogPersistenceAdapter {
  initialize?: () => Promise<void>;
  getEventCount(): Promise<number>;
  persistEvents(...events: StoredEvent[]): Promise<void>;
  loadEvents(...eventTypes: string[]): Promise<StoredEvent[]>;
}
