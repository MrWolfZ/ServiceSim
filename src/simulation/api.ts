import express, { Request, Response } from 'express';
import { filter, take, timeout } from 'rxjs/operators';

import { InvocationResponseWasSet, ServiceInvocation, ServiceRequest, ServiceResponse } from '../domain';
import { eventStream } from '../infrastructure/event-log/event-log';
import { getTopLevelPredicateNodes, PredicateNode } from './predicate-tree';

export const processRequest = async (req: Request, res: Response) => {
  const topLevelPredicates = await getTopLevelPredicateNodes();

  const invocation = ServiceInvocation.create(req.path, req.body);
  await ServiceInvocation.saveAsync(invocation);

  eventStream<InvocationResponseWasSet>(InvocationResponseWasSet.KIND).pipe(
    filter(ev => ev.invocationId === invocation.id),
    take(1),
    timeout(60000),
  ).subscribe(ev => {
    res.status(ev.statusCode).send({
      content: ev.responseBody,
    });
  }, err => {
    res.status(500).send({
      content: JSON.stringify(err),
    });
  });

  let response: ServiceResponse = {
    statusCode: 404,
    body: '',
  };

  const node = findNode(topLevelPredicates);
  if (node) {
    const generator = node.childPredicatesOrResponseGenerator as (request: ServiceRequest) => ServiceResponse;
    response = generator(invocation.request);
  }

  invocation.setResponse(response.statusCode, response.body);
  await ServiceInvocation.saveAsync(invocation);

  function findNode(nodes: PredicateNode[]): PredicateNode | undefined {
    for (const node of nodes) {
      if (!node.childPredicatesOrResponseGenerator) {
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
