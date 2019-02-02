import { EventLogPersistenceAdapter, StoredEvent } from 'src/infrastructure/event-log';

let inMemoryEvents: StoredEvent[] = [];

export const inMemoryEventLogPersistenceAdapter: EventLogPersistenceAdapter = {
  async persistEvents(eventsWithoutSeqNr: Omit<StoredEvent, 'seqNr'>[]): Promise<number[]> {
    return eventsWithoutSeqNr.map(e => {
      const seqNr = inMemoryEvents.length + 1;
      inMemoryEvents.push({ ...e, seqNr });
      return seqNr;
    });
  },

  async loadEvents(eventTypes: string[], aggregateTypes?: string[], allAfterSeqNr?: number): Promise<StoredEvent[]> {
    return inMemoryEvents
      .filter(e => eventTypes.indexOf(e.eventType) >= 0)
      .filter(e => !aggregateTypes || aggregateTypes.indexOf(e.aggregateType || '') >= 0)
      .filter(e => !allAfterSeqNr || e.seqNr > allAfterSeqNr);
  },

  async dropAll() {
    inMemoryEvents = [];
  },
};
