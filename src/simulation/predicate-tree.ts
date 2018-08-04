import {
  PredicateNodeCreated,
  PredicateTemplateCreatedOrUpdated,
  PredicateTemplateDeleted,
  ResponseGeneratorSet,
  ResponseGeneratorTemplateCreatedOrUpdated,
  ServiceRequest,
  ServiceResponse,
} from '../domain';

import { EventLog } from '../infrastructure';

const SUBSCRIBED_EVENT_KINDS: SubscribedEvents['kind'][] = [
  PredicateTemplateCreatedOrUpdated.KIND,
  ResponseGeneratorTemplateCreatedOrUpdated.KIND,
  PredicateNodeCreated.KIND,
  PredicateTemplateDeleted.KIND,
  ResponseGeneratorSet.KIND,
];

type SubscribedEvents =
  | PredicateTemplateCreatedOrUpdated
  | PredicateTemplateDeleted
  | ResponseGeneratorTemplateCreatedOrUpdated
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
    const predicateTemplateEvalFunctionBodies = new Map<string, string>();
    const responseGeneratorTemplateFunctionBodies = new Map<string, string>();
    const predicateNodesById = new Map<string, PredicateNode>();

    return EventLog.getStream<SubscribedEvents>(SUBSCRIBED_EVENT_KINDS).subscribe(ev => {
      // tslint:disable-next-line:switch-default
      switch (ev.kind) {
        case PredicateTemplateCreatedOrUpdated.KIND:
          predicateTemplateEvalFunctionBodies.set(ev.templateId, ev.evalFunctionBody);

          return;

        case PredicateTemplateDeleted.KIND:
          predicateTemplateEvalFunctionBodies.delete(ev.templateId);
          return;

        case ResponseGeneratorTemplateCreatedOrUpdated.KIND:
          responseGeneratorTemplateFunctionBodies.set(ev.templateId, ev.generatorFunctionBody);
          return;

        case PredicateNodeCreated.KIND: {
          const functionBody = ev.predicateTemplateVersionSnapshot.evalFunctionBody;
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
          const generatorFunctionBody = ev.responseGeneratorTemplateVersionSnapshot.generatorFunctionBody;
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
