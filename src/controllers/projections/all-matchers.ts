import * as rmc from '../../domain/request-matcher/request-matcher-created';
import { ServiceRequest } from '../../domain/service-invocation/service-invocation';
import { eventStream } from '../../infrastructure/event-log/event-log';

const SUBSCRIBED_EVENT_KINDS: SubscribedEvents['kind'][] = [rmc.KIND];

type SubscribedEvents =
  | rmc.RequestMatcherCreated
  ;

export interface RequestMatcherView {
  id: string;
  matcherKind: string;
  properties: { [prop: string]: any };
  apply: (request: ServiceRequest) => boolean;
}

const views: RequestMatcherView[] = [];

export function start() {
  return eventStream<SubscribedEvents>(...SUBSCRIBED_EVENT_KINDS).subscribe(ev => {
    switch (ev.kind) {
      case rmc.KIND:
        views.push({
          id: ev.id,
          matcherKind: ev.matcherKind,
          properties: ev.properties,
          apply: () => true,
        });
        return;

      default:
        return;
    }
  });
}

export async function getAllAsync() {
  return views;
}
