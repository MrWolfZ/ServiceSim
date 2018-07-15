import { Request, Response } from 'express';
import { filter, take, timeout } from 'rxjs/operators';

import { InvocationResponseWasSet, ServiceInvocation } from '../domain';
import { eventStream } from '../infrastructure/event-log/event-log';
import { getAllAsync } from './projections/all-predicates';

export let processRequest = async (req: Request, res: Response) => {
  const allPredicates = await getAllAsync();

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

  // TODO: recursive evaluation
  const pred = allPredicates.find(p => p.evaluate(invocation.request, p.properties));

  if (!pred || !pred.childPredicatesOrResponseGenerator || Array.isArray(pred.childPredicatesOrResponseGenerator)) {
    invocation.setResponse(404, '');
    await ServiceInvocation.saveAsync(invocation);
    return;
  }

  const generator = pred.childPredicatesOrResponseGenerator;
  const response = generator.generate(invocation.request, generator.properties);
  invocation.setResponse(response.statusCode, response.body);

  await ServiceInvocation.saveAsync(invocation);
};
