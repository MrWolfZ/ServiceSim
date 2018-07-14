export interface DomainEvent<TKind extends string = string> {
  kind: TKind;
  occurredOnEpoch: number;
  eventVersion: number;
}

export type CustomProperties<T extends DomainEvent<T['kind']>> = Pick<T, Exclude<keyof T, keyof DomainEvent<T['kind']>>>;

export const create = <T extends DomainEvent<T['kind']>>(
  kind: T['kind'],
  eventVersion = 1,
) => (
  customProps: CustomProperties<T>,
  ): T =>
    ({
      kind,
      eventVersion,
      occurredOnEpoch: Date.now(),
      ...(customProps as any),
    });
