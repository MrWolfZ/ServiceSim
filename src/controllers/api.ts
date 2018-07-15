import { Request, Response } from 'express';
import { filter, take, timeout } from 'rxjs/operators';

import * as irws from '../domain/service-invocation/invocation-response-was-set';
import * as si from '../domain/service-invocation/service-invocation';
import { eventStream } from '../infrastructure/event-log/event-log';
import { getAllAsync } from './projections/all-predicates';

export let processRequest = async (req: Request, res: Response) => {
  const allPredicates = await getAllAsync();

  let invocation = si.create(req.path, req.body);

  invocation = await si.saveAsync(invocation);

  eventStream<irws.InvocationResponseWasSet>(irws.KIND).pipe(
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
    invocation = si.setResponse(invocation, 404, '');
    await si.saveAsync(invocation);
    return;
  }

  const generator = pred.childPredicatesOrResponseGenerator;
  const response = generator.generate(invocation.request, generator.properties);
  invocation = si.setResponse(invocation, response.statusCode, response.body);

  await si.saveAsync(invocation);
};
