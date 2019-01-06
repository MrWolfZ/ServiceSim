import express, { Request, Response } from 'express';
import { filter, take, timeout } from 'rxjs/operators';
import { DB } from '../../api-infrastructure';
import { logger } from '../../util/logger';
import { createServiceInvocation, setServiceInvocationResponse } from '../service-invocation/service-invocation.api';
import { InvocationResponseWasSet, ServiceRequest, ServiceResponse } from '../service-invocation/service-invocation.types';
import { getPredicateTree, PredicateNode, ResponseGeneratorFunction } from './predicate-tree.api';

export const processSimulationRequest = async (req: Request, res: Response) => {
  const rootNode = await getPredicateTree();

  const request: ServiceRequest = {
    path: req.path,
    body: req.body,
  };

  const { invocationId, invocationVersion } = await createServiceInvocation(request);

  DB.getEventStream<InvocationResponseWasSet>(['InvocationResponseWasSet']).pipe(
    filter(ev => ev.rootEntityId === invocationId),
    take(1),
    timeout(60000),
  ).subscribe(ev => {
    res.status(ev.statusCode).contentType(ev.contentType).send(ev.body);
  }, err => {
    res.status(500).send({
      content: JSON.stringify(err),
    });
  });

  let response: ServiceResponse = {
    statusCode: 404,
    body: '',
    contentType: '',
  };

  if (rootNode) {
    const node = await findNode(rootNode.childNodesOrResponseGenerator as PredicateNode[]);
    if (node) {
      const generator = node.childNodesOrResponseGenerator as ResponseGeneratorFunction;
      response = await Promise.resolve(generator(request));
    }
  }

  await setServiceInvocationResponse({
    invocationId,
    unmodifiedInvocationVersion: invocationVersion,
    ...response,
  });

  async function findNode(nodes: PredicateNode[]): Promise<PredicateNode | undefined> {
    for (const node of nodes) {
      if (!node.childNodesOrResponseGenerator || Array.isArray(node.childNodesOrResponseGenerator) && node.childNodesOrResponseGenerator.length === 0) {
        logger.debug(`simulation API: skipping node ${node.nodeId} since it has neither child nodes nor a response generator`);
        continue;
      }

      try {
        const nodeEvalutedToTrue = await node.evaluate(request);
        logger.debug(`simulation API: node ${node.nodeId} evaluated to ${nodeEvalutedToTrue}`);
        if (!nodeEvalutedToTrue) {
          continue;
        }
      } catch (e) {
        logger.error(e);
        continue;
      }

      if (!Array.isArray(node.childNodesOrResponseGenerator)) {
        logger.debug(`simulation API: using response generator of node ${node.nodeId}`);
        return node;
      }

      const childNode = await findNode(node.childNodesOrResponseGenerator);
      if (childNode) {
        return childNode;
      }
    }

    logger.debug(`simulation API: no matching node found`);
    return undefined;
  }
};

export const simulationApi = express.Router()
  .use(processSimulationRequest);
