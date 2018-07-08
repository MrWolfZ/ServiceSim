export interface StoredEvent {
  id: number;
  eventKind: string;
  body: string;
}

export function create(
  id: number,
  eventKind: string,
  body: string,
): StoredEvent {
  return {
    id,
    eventKind,
    body,
  };
}
