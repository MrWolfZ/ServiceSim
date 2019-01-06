import { isFailure, unwrap } from '../../util/result-monad';
import * as predicateNodeApi from '../predicate-tree/predicate-node.api';
import { PredicateNodeDto, RootNodeName } from '../predicate-tree/predicate-node.types';
import { ServiceRequest, ServiceResponse } from '../service-invocation/service-invocation.types';

export type ResponseGeneratorFunction = (request: ServiceRequest) => ServiceResponse | Promise<ServiceResponse>;

export interface PredicateNode {
  nodeId: string;
  evaluate: (request: ServiceRequest) => boolean | Promise<boolean>;
  childNodesOrResponseGenerator: PredicateNode[] | ResponseGeneratorFunction;
}

export type PredicateEvaluationFunction = (request: ServiceRequest, parameters: { [prop: string]: any }) => boolean;
export type ResponseGeneratorGenerateFunction = (request: ServiceRequest, parameters: { [prop: string]: any }) => ServiceResponse;

export async function getTreeAsync() {
  const getAllAsyncResult = await predicateNodeApi.getAllAsync();

  if (isFailure(getAllAsyncResult)) {
    return getAllAsyncResult;
  }

  const allNodes = unwrap(getAllAsyncResult);
  const rootNodeName: RootNodeName = 'ROOT';
  const rootNode = allNodes.find(n => n.name === rootNodeName)!;
  return await buildNodeAsync(rootNode.id, allNodes);
}

export async function buildNodeAsync(nodeId: string, allNodes: PredicateNodeDto[]): Promise<PredicateNode> {
  const dto = allNodes.find(n => n.id === nodeId)!;

  let evaluate: PredicateNode['evaluate'];

  if (typeof dto.templateInfoOrEvalFunctionBody === 'string') {
    evaluate = new Function('request', dto.templateInfoOrEvalFunctionBody) as typeof evaluate;
  } else {
    const functionBody = dto.templateInfoOrEvalFunctionBody.templateDataSnapshot.evalFunctionBody;
    const parameterValues = dto.templateInfoOrEvalFunctionBody.parameterValues;
    const evaluationFunction = new Function('request', 'parameters', functionBody) as PredicateEvaluationFunction;
    evaluate = (request => evaluationFunction(request, parameterValues)) as typeof evaluate;
  }

  let childNodesOrResponseGenerator: PredicateNode['childNodesOrResponseGenerator'];

  if (Array.isArray(dto.childNodeIdsOrResponseGenerator)) {
    childNodesOrResponseGenerator = await Promise.all(dto.childNodeIdsOrResponseGenerator.map(id => buildNodeAsync(id, allNodes)));
  } else {
    let generate: ResponseGeneratorFunction;

    if (typeof dto.childNodeIdsOrResponseGenerator.templateInfoOrGeneratorFunctionBody === 'string') {
      generate = new Function('request', dto.childNodeIdsOrResponseGenerator.templateInfoOrGeneratorFunctionBody) as typeof generate;
    } else {
      const functionBody = dto.childNodeIdsOrResponseGenerator.templateInfoOrGeneratorFunctionBody.templateDataSnapshot.generatorFunctionBody;
      const defaultParameterValues = dto.childNodeIdsOrResponseGenerator.templateInfoOrGeneratorFunctionBody.templateDataSnapshot.parameters
        .reduce<{ [prop: string]: any }>((pv, p) => ({ ...pv, [p.name]: p.defaultValue }), {});
      const parameterValues = dto.childNodeIdsOrResponseGenerator.templateInfoOrGeneratorFunctionBody.parameterValues;
      const generatorFunction = new Function('request', 'parameters', functionBody) as ResponseGeneratorGenerateFunction;
      generate = (request => generatorFunction(request, { ...defaultParameterValues, ...parameterValues })) as typeof generate;
    }

    childNodesOrResponseGenerator = generate;
  }

  return {
    nodeId,
    evaluate,
    childNodesOrResponseGenerator,
  };
}
