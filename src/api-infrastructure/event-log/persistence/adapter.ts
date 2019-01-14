export interface StoredEvent {
  seqNr: number;
  eventType: string;
  aggregateType?: string;
  body: any;
}

export interface EventLogPersistenceAdapter {
  initialize?: () => Promise<void>;
  persistEvents(eventsWithoutSeqNr: Omit<StoredEvent, 'seqNr'>[]): Promise<number[]>;
  loadEvents(eventTypes: string[], aggregateTypes?: string[], allAfterSeqNr?: number): Promise<StoredEvent[]>;
  dropAll(): Promise<void>;
}
