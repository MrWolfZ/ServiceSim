import { Request, Response } from 'express';
import * as request from '../domain/request/request';
import { getAllAsync } from './projections/all-matchers';

export let processRequest = async (req: Request, res: Response) => {
  const allMatchers = await getAllAsync();
  const r: request.Request = {
    path: req.path,
    body: req.body,
  };

  allMatchers.forEach(m => {
    if (m.apply(r)) {
      console.log(`matcher ${m.id} matches`);
    }
  });

  res.send({
    content: 'hello world',
  });
};

export type RequestMatcherFunction<TProps = { [prop: string]: any }> = (request: Request, props: TProps) => boolean;
export interface RequestMatcherFunctionMap { [requestMatcherKindId: string]: RequestMatcherFunction; }

export const requestMatcherFunctions: RequestMatcherFunctionMap = {};

export interface Request {

}
