import {
  PredicateKindCreatedOrUpdated,
  PredicateKindDeleted,
  PredicateNodeCreated,
  ResponseGeneratorKindCreatedOrUpdated,
  ResponseGeneratorSet,
  ServiceRequest,
  ServiceResponse,
} from '../domain';

import { EventLog } from '../infrastructure';

const SUBSCRIBED_EVENT_KINDS: SubscribedEvents['kind'][] = [
  PredicateKindCreatedOrUpdated.KIND,
  ResponseGeneratorKindCreatedOrUpdated.KIND,
  PredicateNodeCreated.KIND,
  PredicateKindDeleted.KIND,
  ResponseGeneratorSet.KIND,
];

type SubscribedEvents =
  | PredicateKindCreatedOrUpdated
  | PredicateKindDeleted
  | ResponseGeneratorKindCreatedOrUpdated
  | PredicateNodeCreated
  | ResponseGeneratorSet
  ;

export type ResponseGeneratorFunction = (request: ServiceRequest) => ServiceResponse | Promise<ServiceResponse>;

export interface PredicateNode {
  nodeId: string;
  parameterValues: { [prop: string]: any };
  evaluate: (request: ServiceRequest) => boolean | Promise<boolean>;
  childNodesOrResponseGenerator: PredicateNode[] | ResponseGeneratorFunction | undefined;
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

          return;

        case PredicateKindDeleted.KIND:
          predicateKindEvalFunctionBodies.delete(ev.predicateKindId);
          return;

        case ResponseGeneratorKindCreatedOrUpdated.KIND:
          responseGeneratorKindFunctionBodies.set(ev.responseGeneratorKindId, ev.generatorFunctionBody);
          return;

        case PredicateNodeCreated.KIND: {
          const functionBody = ev.predicateKindVersionSnapshot.evalFunctionBody;
          const evaluationFunction = new Function('request', 'parameters', functionBody) as PredicateEvaluationFunction;

          const node: PredicateNode = {
            nodeId: ev.nodeId,
            parameterValues: ev.parameterValues,
            evaluate: request => evaluationFunction(request, ev.parameterValues),
            childNodesOrResponseGenerator: undefined,
          };

          topLevelPredicateNodes.push(node);
          predicateNodesById.set(ev.nodeId, node);
          return;
        }

        case ResponseGeneratorSet.KIND:
          const predicateNode = predicateNodesById.get(ev.predicateNodeId)!;
          const generatorFunctionBody = ev.responseGeneratorKindVersionSnapshot.generatorFunctionBody;
          const generatorFunction = new Function('request', 'parameters', generatorFunctionBody) as ResponseGeneratorGenerateFunction;
          predicateNode.childNodesOrResponseGenerator = request => generatorFunction(request, ev.parameterValues);
          return;
      }
    });
  }

  static async getTopLevelNodes() {
    return topLevelPredicateNodes;
  }
}
