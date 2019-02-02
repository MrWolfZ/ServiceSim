import { EventLogPersistenceAdapter, StoredEvent } from 'src/infrastructure/event-log';

export const nullEventLogPersistenceAdapter: EventLogPersistenceAdapter = {
  async persistEvents(eventsWithoutSeqNr: Omit<StoredEvent, 'seqNr'>[]): Promise<number[]> {
    return eventsWithoutSeqNr.map(() => -1);
  },

  async loadEvents(_: string[], _1?: string[], _2?: number): Promise<StoredEvent[]> {
    return [];
  },

  async dropAll() { },
};
