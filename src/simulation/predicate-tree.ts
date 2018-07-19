import {
  PredicateCreated,
  PredicateKindCreated,
  ResponseGeneratorKindCreated,
  ResponseGeneratorSet,
  ServiceRequest,
  ServiceResponse,
} from '../domain';

import { eventStream } from '../infrastructure/event-log/event-log';

const SUBSCRIBED_EVENT_KINDS: SubscribedEvents['kind'][] = [
  PredicateKindCreated.KIND,
  ResponseGeneratorKindCreated.KIND,
  PredicateCreated.KIND,
  ResponseGeneratorSet.KIND,
];

type SubscribedEvents =
  | PredicateKindCreated
  | ResponseGeneratorKindCreated
  | PredicateCreated
  | ResponseGeneratorSet
  ;

export interface PredicateNode {
  predicateId: string;
  evaluate: (request: ServiceRequest) => boolean;
  childPredicatesOrResponseGenerator: PredicateNode[] | ((request: ServiceRequest) => ServiceResponse) | undefined;
}

export type PredicateEvaluationFunction = (request: ServiceRequest, properties: { [prop: string]: any }) => boolean;
export type ResponseGeneratorGenerateFunction = (request: ServiceRequest, properties: { [prop: string]: any }) => ServiceResponse;

const topLevelPredicateNodes: PredicateNode[] = [];

export function start() {
  const predicateKindEvalFunctionBodies = new Map<string, string>();
  const responseGeneratorKindFunctionBodies = new Map<string, string>();
  const predicateNodesById = new Map<string, PredicateNode>();

  return eventStream<SubscribedEvents>(...SUBSCRIBED_EVENT_KINDS).subscribe(ev => {
    // tslint:disable-next-line:switch-default
    switch (ev.kind) {
      case PredicateKindCreated.KIND:
        predicateKindEvalFunctionBodies.set(ev.predicateKindId, ev.evalFunctionBody);
        return;

      case ResponseGeneratorKindCreated.KIND:
        responseGeneratorKindFunctionBodies.set(ev.responseGeneratorKindId, ev.generatorFunctionBody);
        return;

      case PredicateCreated.KIND: {
        const functionBody = predicateKindEvalFunctionBodies.get(ev.predicateKindId)!;
        const evaluationFunction = new Function('request', 'properties', functionBody) as PredicateEvaluationFunction;

        const node: PredicateNode = {
          predicateId: ev.predicateId,
          evaluate: request => evaluationFunction(request, ev.properties),
          childPredicatesOrResponseGenerator: undefined,
        };

        topLevelPredicateNodes.push(node);
        predicateNodesById.set(ev.predicateId, node);
        return;
      }

      case ResponseGeneratorSet.KIND:
        const predicateNode = predicateNodesById.get(ev.predicateId)!;
        const generatorFunctionBody = responseGeneratorKindFunctionBodies.get(ev.responseGeneratorKindId)!;
        const generatorFunction = new Function('request', 'properties', generatorFunctionBody) as ResponseGeneratorGenerateFunction;
        predicateNode.childPredicatesOrResponseGenerator = request => generatorFunction(request, ev.properties);
        return;
    }
  });
}

export async function getTopLevelPredicateNodes() {
  return topLevelPredicateNodes;
}
