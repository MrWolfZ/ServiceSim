import { EventValue } from './event-value';

export interface StoredEvent {
  id: number;
  eventValue: EventValue;
}

export function create(
  id: number,
  eventValue: EventValue,
): StoredEvent {
  return {
    id,
    eventValue,
  };
}
