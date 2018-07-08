export interface EventValue {
  body: string;
  snapshot: string;
  streamName: string;
  streamVersion: number;
}

export const NULL: EventValue = {
  body: '',
  snapshot: '',
  streamName: '',
  streamVersion: 0,
};

export function hasSnapshot(eventValue: EventValue) {
  return eventValue.snapshot.length > 0;
}
