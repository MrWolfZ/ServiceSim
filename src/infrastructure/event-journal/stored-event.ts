export interface StoredEvent {
  id: number;
  body: string;
  snapshot: string;
  streamName: string;
  streamVersion: number;
}

export function hasSnapshot(storedEvent: StoredEvent) {
  return storedEvent.snapshot.length > 0;
}
