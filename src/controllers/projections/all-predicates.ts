import * as pkc from '../../domain/predicate-kind/predicate-kind-created';
import * as pc from '../../domain/predicate/predicate-created';
import * as rgs from '../../domain/predicate/response-generator-set';
import * as rgkc from '../../domain/response-generator-kind/response-generator-kind-created';
import * as rgc from '../../domain/response-generator/response-generator-created';
import { ServiceRequest, ServiceResponse } from '../../domain/service-invocation/service-invocation';
import { eventStream } from '../../infrastructure/event-log/event-log';

const SUBSCRIBED_EVENT_KINDS: SubscribedEvents['kind'][] = [
  pkc.KIND,
  rgkc.KIND,
  rgc.KIND,
  pc.KIND,
  rgs.KIND,
];

type SubscribedEvents =
  | pkc.PredicateKindCreated
  | rgkc.ResponseGeneratorKindCreated
  | rgc.ResponseGeneratorCreated
  | pc.PredicateCreated
  | rgs.ResponseGeneratorSet
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
      case pkc.KIND:
        predicateKindEvalFunctionBodies.set(ev.predicateKindId, ev.evalFunctionBody);
        return;

      case rgkc.KIND:
        responseGeneratorKindFunctionBodies.set(ev.responseGeneratorKindId, ev.generatorFunctionBody);
        return;

      case rgc.KIND:
        responseGenerators.set(ev.responseGeneratorId, {
          properties: ev.properties,
          functionBody: responseGeneratorKindFunctionBodies.get(ev.responseGeneratorKindId)!,
        });

        return;

      case pc.KIND:
        views.push({
          predicateId: ev.predicateId,
          properties: ev.properties,
          evaluate: new Function('request', 'properties', predicateKindEvalFunctionBodies.get(ev.predicateKindId)!) as any,
          childPredicatesOrResponseGenerator: undefined,
        });

        return;

      case rgs.KIND:
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
