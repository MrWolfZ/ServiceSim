import express, { Request, Response } from 'express';
import { filter, take, timeout } from 'rxjs/operators';
import { DB } from '../../api-infrastructure';
import { logger } from '../../util/logger';
import { isFailure, unwrap } from '../../util/result-monad';
import * as serviceInvocationApi from '../service-invocation/service-invocation.api';
import { InvocationResponseWasSet, ServiceRequest, ServiceResponse } from '../service-invocation/service-invocation.types';
import * as predicateTreeApi from './predicate-tree.api';

export const processRequest = async (req: Request, res: Response) => {
  const getTreeResult = await predicateTreeApi.getTreeAsync();

  if (isFailure(getTreeResult)) {
    res.status(500).send({ messages: getTreeResult.failure });
    return;
  }

  const rootNode = unwrap(getTreeResult);

  const request: ServiceRequest = {
    path: req.path,
    body: req.body,
  };

  const createResult = await serviceInvocationApi.createAsync(request);

  if (isFailure(createResult)) {
    res.status(500).send({ messages: createResult.failure });
    return;
  }

  DB.getEventStream<InvocationResponseWasSet>(['InvocationResponseWasSet']).pipe(
    filter(ev => ev.rootEntityId === unwrap(createResult).invocationId),
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

  const node = await findNode(rootNode.childNodesOrResponseGenerator as predicateTreeApi.PredicateNode[]);
  if (node) {
    const generator = node.childNodesOrResponseGenerator as predicateTreeApi.ResponseGeneratorFunction;
    response = await Promise.resolve(generator(request));
  }

  const setResponseResult = await serviceInvocationApi.setServiceResponseAsync({
    invocationId: unwrap(createResult).invocationId,
    unmodifiedInvocationVersion: unwrap(createResult).invocationVersion,
    ...response,
  });

  if (isFailure(setResponseResult)) {
    res.status(500).send({ messages: setResponseResult.failure });
    return;
  }

  async function findNode(nodes: predicateTreeApi.PredicateNode[]): Promise<predicateTreeApi.PredicateNode | undefined> {
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

const api = express.Router();
api.use(processRequest);

export default api;
