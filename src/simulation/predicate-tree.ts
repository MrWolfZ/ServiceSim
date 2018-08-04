import {
  PredicateCreated,
  PredicateKindCreatedOrUpdated,
  PredicateKindDeleted,
  ResponseGeneratorKindCreatedOrUpdated,
  ResponseGeneratorSet,
  ServiceRequest,
  ServiceResponse,
} from '../domain';

import { EventLog } from '../infrastructure';

const SUBSCRIBED_EVENT_KINDS: SubscribedEvents['kind'][] = [
  PredicateKindCreatedOrUpdated.KIND,
  ResponseGeneratorKindCreatedOrUpdated.KIND,
  PredicateCreated.KIND,
  PredicateKindDeleted.KIND,
  ResponseGeneratorSet.KIND,
];

type SubscribedEvents =
  | PredicateKindCreatedOrUpdated
  | PredicateKindDeleted
  | ResponseGeneratorKindCreatedOrUpdated
  | PredicateCreated
  | ResponseGeneratorSet
  ;

export type ResponseGeneratorFunction = (request: ServiceRequest) => ServiceResponse | Promise<ServiceResponse>;

export interface PredicateNode {
  predicateId: string;
  predicateKindId: string;
  parameterValues: { [prop: string]: any };
  evaluate: (request: ServiceRequest) => boolean | Promise<boolean>;
  childPredicatesOrResponseGenerator: PredicateNode[] | ResponseGeneratorFunction | undefined;
}

export type PredicateEvaluationFunction = (request: ServiceRequest, parameters: { [prop: string]: any }) => boolean;
export type ResponseGeneratorGenerateFunction = (request: ServiceRequest, parameters: { [prop: string]: any }) => ServiceResponse;

const topLevelPredicateNodes: PredicateNode[] = [];

export class PredicateTree {
  static start() {
    const predicateKindEvalFunctionBodies = new Map<string, string>();
    const responseGeneratorKindFunctionBodies = new Map<string, string>();
    const predicateNodesById = new Map<string, PredicateNode>();

    return EventLog.getStream<SubscribedEvents>(SUBSCRIBED_EVENT_KINDS).subscribe(ev => {
      // tslint:disable-next-line:switch-default
      switch (ev.kind) {
        case PredicateKindCreatedOrUpdated.KIND:
          predicateKindEvalFunctionBodies.set(ev.predicateKindId, ev.evalFunctionBody);
          const evaluationFunction = new Function('request', 'parameters', ev.evalFunctionBody) as PredicateEvaluationFunction;
          for (const node of predicateNodesById.values()) {
            if (node.predicateKindId === ev.predicateKindId) {
              node.evaluate = request => evaluationFunction(request, node.parameterValues);
            }
          }

          return;

        case PredicateKindDeleted.KIND:
          predicateKindEvalFunctionBodies.delete(ev.predicateKindId);
          return;

        case ResponseGeneratorKindCreatedOrUpdated.KIND:
          responseGeneratorKindFunctionBodies.set(ev.responseGeneratorKindId, ev.generatorFunctionBody);
          return;

        case PredicateCreated.KIND: {
          const functionBody = predicateKindEvalFunctionBodies.get(ev.predicateKindId)!;
          const evaluationFunction = new Function('request', 'parameters', functionBody) as PredicateEvaluationFunction;

          const node: PredicateNode = {
            predicateId: ev.predicateId,
            predicateKindId: ev.predicateKindId,
            parameterValues: ev.parameterValues,
            evaluate: request => evaluationFunction(request, ev.parameterValues),
            childPredicatesOrResponseGenerator: undefined,
          };

          topLevelPredicateNodes.push(node);
          predicateNodesById.set(ev.predicateId, node);
          return;
        }

        case ResponseGeneratorSet.KIND:
          const predicateNode = predicateNodesById.get(ev.predicateId)!;
          const generatorFunctionBody = responseGeneratorKindFunctionBodies.get(ev.responseGeneratorKindId)!;
          const generatorFunction = new Function('request', 'parameters', generatorFunctionBody) as ResponseGeneratorGenerateFunction;
          predicateNode.childPredicatesOrResponseGenerator = request => generatorFunction(request, ev.parameterValues);
          return;
      }
    });
  }

  static async getTopLevelNodes() {
    return topLevelPredicateNodes;
  }
}
