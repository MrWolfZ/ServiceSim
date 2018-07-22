import {
  PredicateCreated,
  PredicateKindCreated,
  PredicateKindDeleted,
  PredicateKindUpdated,
  ResponseGeneratorKindCreated,
  ResponseGeneratorSet,
  ServiceRequest,
  ServiceResponse,
} from '../domain';

import { EventLog } from '../infrastructure';

const SUBSCRIBED_EVENT_KINDS: SubscribedEvents['kind'][] = [
  PredicateKindCreated.KIND,
  ResponseGeneratorKindCreated.KIND,
  PredicateCreated.KIND,
  PredicateKindUpdated.KIND,
  PredicateKindDeleted.KIND,
  ResponseGeneratorSet.KIND,
];

type SubscribedEvents =
  | PredicateKindCreated
  | ResponseGeneratorKindCreated
  | PredicateCreated
  | PredicateKindUpdated
  | PredicateKindDeleted
  | ResponseGeneratorSet
  ;

export type ResponseGeneratorFunction = (request: ServiceRequest) => ServiceResponse | Promise<ServiceResponse>;

export interface PredicateNode {
  predicateId: string;
  predicateKindId: string;
  properties: { [prop: string]: any };
  evaluate: (request: ServiceRequest) => boolean | Promise<boolean>;
  childPredicatesOrResponseGenerator: PredicateNode[] | ResponseGeneratorFunction | undefined;
}

export type PredicateEvaluationFunction = (request: ServiceRequest, properties: { [prop: string]: any }) => boolean;
export type ResponseGeneratorGenerateFunction = (request: ServiceRequest, properties: { [prop: string]: any }) => ServiceResponse;

const topLevelPredicateNodes: PredicateNode[] = [];

export class PredicateTree {
  static start() {
    const predicateKindEvalFunctionBodies = new Map<string, string>();
    const responseGeneratorKindFunctionBodies = new Map<string, string>();
    const predicateNodesById = new Map<string, PredicateNode>();

    return EventLog.getStream<SubscribedEvents>(...SUBSCRIBED_EVENT_KINDS).subscribe(ev => {
      // tslint:disable-next-line:switch-default
      switch (ev.kind) {
        case PredicateKindCreated.KIND:
          predicateKindEvalFunctionBodies.set(ev.predicateKindId, ev.evalFunctionBody);
          return;

        case PredicateKindUpdated.KIND: {
          predicateKindEvalFunctionBodies.set(ev.predicateKindId, ev.evalFunctionBody);
          const evaluationFunction = new Function('request', 'properties', ev.evalFunctionBody) as PredicateEvaluationFunction;
          for (const node of predicateNodesById.values()) {
            if (node.predicateKindId === ev.predicateKindId) {
              node.evaluate = request => evaluationFunction(request, node.properties);
            }
          }

          return;
        }

        case PredicateKindDeleted.KIND:
          predicateKindEvalFunctionBodies.delete(ev.predicateKindId);
          return;

        case ResponseGeneratorKindCreated.KIND:
          responseGeneratorKindFunctionBodies.set(ev.responseGeneratorKindId, ev.generatorFunctionBody);
          return;

        case PredicateCreated.KIND: {
          const functionBody = predicateKindEvalFunctionBodies.get(ev.predicateKindId)!;
          const evaluationFunction = new Function('request', 'properties', functionBody) as PredicateEvaluationFunction;

          const node: PredicateNode = {
            predicateId: ev.predicateId,
            predicateKindId: ev.predicateKindId,
            properties: ev.properties,
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

  static async getTopLevelNodes() {
    return topLevelPredicateNodes;
  }
}
