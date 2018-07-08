import { DomainEvent } from '../domain-event';
import { loadEventsAsync, persistEventsAsync } from './persistence';

export type AsyncEventCallback<TEvent extends DomainEvent = DomainEvent> = (ev: TEvent) => Promise<void>;

interface Subscription<TEvent extends DomainEvent = DomainEvent> {
  subscriptionId: number;
  callback: AsyncEventCallback<TEvent>;
}

interface BufferedSubscription<TEvent extends DomainEvent = DomainEvent> {
  subscriptionId: number;
  eventKinds: string[];
  bufferedEvents: TEvent[];
}

// we structure this map like this for efficiency reasons; we must be able
// to find all active subscriptions for a given event kind quickly while
// finding a specific subscription is only relevant for unsubscribing which
// is allowed to be less performant since it happens much more rarely
const subscriptions: { [eventKind: string]: Subscription<any>[] } = {};

// for buffered subscriptions we must maintain the order in which the events
// were buffered so instead of storing them by event kind we store them by
// subscription ID
const bufferedSubscriptions: { [subscriptionId: number]: BufferedSubscription<any> } = {};

let currentSubscriptionId = 0;

export async function subscribeAsync<TEvent extends DomainEvent = DomainEvent>(
  callback: AsyncEventCallback<TEvent>,
  ...eventKinds: string[]
): Promise<() => void> {
  const subscriptionId = currentSubscriptionId += 1;

  bufferedSubscriptions[subscriptionId] = {
    subscriptionId,
    bufferedEvents: [],
    eventKinds,
  };

  const events = await loadEventsAsync<TEvent>(...eventKinds);

  for (const ev of events) {
    await callback(ev);
  }

  for (const ev of bufferedSubscriptions[subscriptionId].bufferedEvents) {
    await callback(ev);
  }

  delete bufferedSubscriptions[subscriptionId];

  eventKinds.forEach(kind => {
    subscriptions[kind] = subscriptions[kind] || [];
    subscriptions[kind].push({ subscriptionId, callback });
  });

  return () => {
    Object.keys(subscriptions)
      .forEach(eventKind => {
        subscriptions[eventKind] = subscriptions[eventKind].filter(s => s.subscriptionId !== subscriptionId);
      });
  };
}

export async function publishAsync(
  ...events: DomainEvent[]
): Promise<void> {
  await persistEventsAsync(events);

  for (const event of events) {
    const subs = subscriptions[event.kind] || [];
    for (const sub of subs) {
      await sub.callback(event);
    }

    Object.keys(bufferedSubscriptions)
      .map(subId => bufferedSubscriptions[parseInt(subId, 10)])
      .filter(sub => sub.eventKinds.indexOf(event.kind) >= 0)
      .forEach(sub => sub.bufferedEvents.push(event));
  }
}
