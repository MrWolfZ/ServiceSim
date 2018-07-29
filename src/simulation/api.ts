import express, { Request, Response } from 'express';
import { filter, take, timeout } from 'rxjs/operators';

import { InvocationResponseWasSet, ServiceInvocation, ServiceResponse } from '../domain';
import { EventLog } from '../infrastructure';
import { logger } from '../util';
import { PredicateNode, PredicateTree, ResponseGeneratorFunction } from './predicate-tree';

export const processRequest = async (req: Request, res: Response) => {
  const topLevelPredicates = await PredicateTree.getTopLevelNodes();

  const invocation = ServiceInvocation.create(req.path, req.body);
  await ServiceInvocation.saveAsync(invocation);

  EventLog.getStream<InvocationResponseWasSet>([InvocationResponseWasSet.KIND]).pipe(
    filter(ev => ev.invocationId === invocation.id),
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

  const node = await findNode(topLevelPredicates);
  if (node) {
    const generator = node.childPredicatesOrResponseGenerator as ResponseGeneratorFunction;
    response = await Promise.resolve(generator(invocation.request));
  }

  invocation.setResponse(response.statusCode, response.body, response.contentType);
  await ServiceInvocation.saveAsync(invocation);

  async function findNode(nodes: PredicateNode[]): Promise<PredicateNode | undefined> {
    for (const node of nodes) {
      if (!node.childPredicatesOrResponseGenerator) {
        continue;
      }

      try {
        if (!await Promise.resolve(node.evaluate(invocation.request))) {
          continue;
        }
      } catch (e) {
        logger.error(e);
        continue;
      }

      if (!Array.isArray(node.childPredicatesOrResponseGenerator)) {
        return node;
      }

      const childNode = findNode(node.childPredicatesOrResponseGenerator);
      if (childNode) {
        return childNode;
      }
    }

    return undefined;
  }
};

const api = express.Router();
api.use(processRequest);

export default api;
