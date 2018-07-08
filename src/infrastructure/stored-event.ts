import { EventValue } from './event-value';

export const NO_ID = -1;

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

export function isValid(
  storedEvent: StoredEvent,
) {
  return storedEvent.id !== NO_ID;
}
