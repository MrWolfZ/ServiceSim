import { getAllPredicateNodes, PredicateNodeDto } from 'src/application/predicate-tree/queries/get-all-predicate-nodes';
import { RootNodeName } from 'src/domain/predicate-tree';
import { ServiceRequest, ServiceResponse } from '../service-invocation/service-invocation.types';

export type ResponseGeneratorFunction = (request: ServiceRequest) => ServiceResponse | Promise<ServiceResponse>;

export interface PredicateNode {
  nodeId: string;
  evaluate: (request: ServiceRequest) => boolean | Promise<boolean>;
  childNodesOrResponseGenerator: PredicateNode[] | ResponseGeneratorFunction;
}

export type PredicateEvaluationFunction = (request: ServiceRequest, parameters: { [prop: string]: any }) => boolean;
export type ResponseGeneratorGenerateFunction = (request: ServiceRequest, parameters: { [prop: string]: any }) => ServiceResponse;

export async function getPredicateTree() {
  const allNodes = await getAllPredicateNodes({});

  const rootNodeName: RootNodeName = 'ROOT';
  const rootNode = allNodes.find(n => n.name === rootNodeName);
  return rootNode && await buildNode(rootNode.id, allNodes);
}

export async function buildNode(nodeId: string, allNodes: PredicateNodeDto[]): Promise<PredicateNode> {
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
    childNodesOrResponseGenerator = await Promise.all(dto.childNodeIdsOrResponseGenerator.map(id => buildNode(id, allNodes)));
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
