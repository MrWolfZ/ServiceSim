import { EventLog } from '../../api-infrastructure';
import { PredicateNodeCreated, ResponseGeneratorSet } from '../predicate-tree/predicate-node.events';
import { ServiceRequest, ServiceResponse } from '../service-invocation/service-invocation';

const SUBSCRIBED_EVENT_KINDS: SubscribedEvents['kind'][] = [
  PredicateNodeCreated.KIND,
  ResponseGeneratorSet.KIND,
];

type SubscribedEvents =
  | PredicateNodeCreated
  | ResponseGeneratorSet
  ;

export type ResponseGeneratorFunction = (request: ServiceRequest) => ServiceResponse | Promise<ServiceResponse>;

export interface PredicateNode {
  nodeId: string;
  evaluate: (request: ServiceRequest) => boolean | Promise<boolean>;
  childNodesOrResponseGenerator: PredicateNode[] | ResponseGeneratorFunction | undefined;
}

export type PredicateEvaluationFunction = (request: ServiceRequest, parameters: { [prop: string]: any }) => boolean;
export type ResponseGeneratorGenerateFunction = (request: ServiceRequest, parameters: { [prop: string]: any }) => ServiceResponse;

const topLevelPredicateNodes: PredicateNode[] = [];

export class PredicateTree {
  static start() {
    const predicateNodesById = new Map<string, PredicateNode>();

    return EventLog.getStream<SubscribedEvents>(SUBSCRIBED_EVENT_KINDS).subscribe(ev => {
      // tslint:disable-next-line:switch-default
      switch (ev.kind) {
        case PredicateNodeCreated.KIND: {
          let evaluate: PredicateNode['evaluate'];

          if (typeof ev.data.templateInfoOrEvalFunctionBody === 'string') {
            evaluate = new Function('request', ev.data.templateInfoOrEvalFunctionBody) as typeof evaluate;
          } else {
            const functionBody = ev.data.templateInfoOrEvalFunctionBody.templateDataSnapshot.evalFunctionBody;
            const parameterValues = ev.data.templateInfoOrEvalFunctionBody.parameterValues;
            const evaluationFunction = new Function('request', 'parameters', functionBody) as PredicateEvaluationFunction;
            evaluate = (request => evaluationFunction(request, parameterValues)) as typeof evaluate;
          }

          const node: PredicateNode = {
            nodeId: ev.nodeId,
            evaluate,
            childNodesOrResponseGenerator: undefined,
          };

          topLevelPredicateNodes.push(node);
          predicateNodesById.set(ev.nodeId, node);
          return;
        }

        case ResponseGeneratorSet.KIND:
          const predicateNode = predicateNodesById.get(ev.nodeId)!;

          let generate: ResponseGeneratorFunction;

          if (typeof ev.responseGenerator.templateInfoOrGeneratorFunctionBody === 'string') {
            generate = new Function('request', ev.responseGenerator.templateInfoOrGeneratorFunctionBody) as typeof generate;
          } else {
            const functionBody = ev.responseGenerator.templateInfoOrGeneratorFunctionBody.templateDataSnapshot.generatorFunctionBody;
            const defaultParameterValues = ev.responseGenerator.templateInfoOrGeneratorFunctionBody.templateDataSnapshot.parameters
              .reduce<{ [prop: string]: any }>((pv, p) => ({ ...pv, [p.name]: p.defaultValue }), {});
            const parameterValues = ev.responseGenerator.templateInfoOrGeneratorFunctionBody.parameterValues;
            const generatorFunction = new Function('request', 'parameters', functionBody) as ResponseGeneratorGenerateFunction;
            generate = (request => generatorFunction(request, { ...defaultParameterValues, ...parameterValues })) as typeof generate;
          }

          predicateNode.childNodesOrResponseGenerator = generate;
          return;
      }
    });
  }

  static async getTopLevelNodes() {
    return topLevelPredicateNodes;
  }
}
