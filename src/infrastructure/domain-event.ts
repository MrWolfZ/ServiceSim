export interface DomainEvent<TKind = string> {
  kind: TKind;
  occurredOnEpoch: number;
  eventVersion: number;
}

export const NULL: DomainEvent = {
  kind: '',
  occurredOnEpoch: 0,
  eventVersion: 0,
};

export function createFactory<T extends DomainEvent, TKind = string>(
  kind: TKind,
  factory: (base: DomainEvent<TKind>) => T,
) {
  return (
    eventVersion = 1,
  ): T =>
    factory({
      ...NULL,
      kind,
      eventVersion,
      occurredOnEpoch: Date.now(),
    });
}
