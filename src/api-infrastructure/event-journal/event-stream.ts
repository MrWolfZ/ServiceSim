import { StoredEvent } from './stored-event';

export interface EventStream {
  streamName: string;
  streamVersion: number;
  stream: StoredEvent[];
  snapshot: string;
}

export const NULL: EventStream = {
  streamName: '',
  streamVersion: 0,
  stream: [],
  snapshot: '',
};

export function hasSnapshot(eventStream: EventStream) {
  return eventStream.snapshot.length > 0;
}
