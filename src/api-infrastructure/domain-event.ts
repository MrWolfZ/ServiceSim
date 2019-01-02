import { DomainEventData } from './api-infrastructure.types';

export interface EventConstructor<T extends DomainEvent<T['kind']>> {
  new(...args: any[]): T;
  readonly KIND: T['kind'];
}

export abstract class DomainEvent<TKind extends string = string> implements DomainEventData {
  kind: TKind;
  occurredOnEpoch: number;
  eventVersion: number;

  static readonly createBase = <T extends DomainEvent<T['kind']>>(
    cons: EventConstructor<T>,
    eventVersion = 1,
  ) => (
    customProps: Pick<T, Exclude<keyof T, keyof DomainEvent<T['kind']>>>,
    ): T => {
      const instance = new cons();
      instance.kind = cons.KIND;
      instance.occurredOnEpoch = Date.now();
      instance.eventVersion = eventVersion;
      Object.assign(instance, customProps);
      return instance;
    }
}
