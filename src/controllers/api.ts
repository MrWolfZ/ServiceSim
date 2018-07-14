import { Request, Response } from 'express';
import { filter, take, timeout } from 'rxjs/operators';
import uuid from 'uuid';

import * as irws from '../domain/service-invocation/invocation-response-was-set';
import * as si from '../domain/service-invocation/service-invocation';
import { eventStream } from '../infrastructure/event-log/event-log';

export let processRequest = async (req: Request, res: Response) => {
  const invocationId = `service-invocation/${uuid()}`;

  let invocation = si.create(invocationId, req.path, req.body);

  invocation = await si.saveAsync(invocation);

  eventStream<irws.InvocationResponseWasSet>(irws.KIND).pipe(
    filter(ev => ev.invocationId === invocationId),
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

  invocation = si.setResponse(invocation, 200, 'Hello World');

  await si.saveAsync(invocation);
};
