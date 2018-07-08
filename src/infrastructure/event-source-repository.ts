import { DomainEvent } from './domain-event';
import * as eb from './event-batch';
import { EventValue } from './event-value';

export function toBatch(
  domainEvents: DomainEvent[],
  snapshotValue?: any,
): eb.EventBatch {
  return domainEvents.reduce((b, ev, idx) => {
    const eventBody = JSON.stringify(ev);
    const shouldAddSnapshot = !!snapshotValue && idx === domainEvents.length - 1;
    const snapshot = shouldAddSnapshot ? JSON.stringify(snapshotValue) : undefined;
    return eb.addEntry(eventBody, snapshot)(b);
  }, eb.NULL);
}

export function toEvents<TEvent extends DomainEvent = DomainEvent>(
  stream: EventValue[],
): TEvent[] {
  return stream.map(ev => JSON.parse(ev.body) as TEvent);
}
