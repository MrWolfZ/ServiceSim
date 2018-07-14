import { Request, Response } from 'express';
import * as irws from '../domain/service-invocation/invocation-response-was-set';
import * as si from '../domain/service-invocation/service-invocation';
import { subscribeOneAsync } from '../infrastructure/event-log/event-log';

export let processRequest = async (req: Request, res: Response) => {
  let invocation = si.create('', req.path, req.body);

  invocation = await si.saveAsync(invocation);

  await subscribeOneAsync<irws.InvocationResponseWasSet>(async ev => {
    res.status(ev.statusCode).send({
      content: ev.responseBody,
    });
  }, irws.KIND);

  invocation = si.setResponse(invocation, 200, 'Hello World');

  await si.saveAsync(invocation);
};

export type RequestMatcherFunction<TProps = { [prop: string]: any }> = (request: Request, props: TProps) => boolean;
export interface RequestMatcherFunctionMap { [requestMatcherKindId: string]: RequestMatcherFunction; }

export const requestMatcherFunctions: RequestMatcherFunctionMap = {};

export interface Request {

}
