export interface Entry {
  body: string;
  snapshot: string;
}

export interface EventBatch {
  entries: Entry[];
}

export const NULL: EventBatch = {
  entries: [],
};

export function addEntry(
  body: string,
  snapshot: string = '',
) {
  return (
    batch: EventBatch,
  ): EventBatch => ({
    entries: [
      ...batch.entries,
      {
        body,
        snapshot,
      },
    ],
  });
}
