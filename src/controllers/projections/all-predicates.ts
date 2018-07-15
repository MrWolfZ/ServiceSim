import {
  PredicateCreated,
  PredicateKindCreated,
  ResponseGeneratorCreated,
  ResponseGeneratorKindCreated,
  ResponseGeneratorSet,
  ServiceRequest,
  ServiceResponse,
} from '../../domain';
import { eventStream } from '../../infrastructure/event-log/event-log';

const SUBSCRIBED_EVENT_KINDS: SubscribedEvents['kind'][] = [
  PredicateKindCreated.KIND,
  ResponseGeneratorKindCreated.KIND,
  ResponseGeneratorCreated.KIND,
  PredicateCreated.KIND,
  ResponseGeneratorSet.KIND,
];

type SubscribedEvents =
  | PredicateKindCreated
  | ResponseGeneratorKindCreated
  | ResponseGeneratorCreated
  | PredicateCreated
  | ResponseGeneratorSet
  ;

export interface ResponseGeneratorView {
  properties: { [prop: string]: any };
  generate: (request: ServiceRequest, properties: { [prop: string]: any }) => ServiceResponse;
}

export interface PredicateView {
  predicateId: string;
  properties: { [prop: string]: any };
  evaluate: (request: ServiceRequest, properties: { [prop: string]: any }) => boolean;
  childPredicatesOrResponseGenerator: PredicateView[] | ResponseGeneratorView | undefined;
}

const views: PredicateView[] = [];

export function start() {
  const predicateKindEvalFunctionBodies = new Map<string, string>();
  const responseGeneratorKindFunctionBodies = new Map<string, string>();
  const responseGenerators = new Map<string, {
    properties: { [prop: string]: any };
    functionBody: string;
  }>();

  return eventStream<SubscribedEvents>(...SUBSCRIBED_EVENT_KINDS).subscribe(ev => {
    switch (ev.kind) {
      case PredicateKindCreated.KIND:
        predicateKindEvalFunctionBodies.set(ev.predicateKindId, ev.evalFunctionBody);
        return;

      case ResponseGeneratorKindCreated.KIND:
        responseGeneratorKindFunctionBodies.set(ev.responseGeneratorKindId, ev.generatorFunctionBody);
        return;

      case ResponseGeneratorCreated.KIND:
        responseGenerators.set(ev.responseGeneratorId, {
          properties: ev.properties,
          functionBody: responseGeneratorKindFunctionBodies.get(ev.responseGeneratorKindId)!,
        });

        return;

      case PredicateCreated.KIND:
        views.push({
          predicateId: ev.predicateId,
          properties: ev.properties,
          evaluate: new Function('request', 'properties', predicateKindEvalFunctionBodies.get(ev.predicateKindId)!) as any,
          childPredicatesOrResponseGenerator: undefined,
        });

        return;

      case ResponseGeneratorSet.KIND:
        const view = views.find(v => v.predicateId === ev.predicateId)!;
        const generator = responseGenerators.get(ev.responseGeneratorId)!;
        view.childPredicatesOrResponseGenerator = {
          properties: generator.properties,
          generate: new Function('request', 'properties', generator.functionBody) as any,
        };

        return;

      default:
        return;
    }
  });
}

export async function getAllAsync() {
  return views;
}
