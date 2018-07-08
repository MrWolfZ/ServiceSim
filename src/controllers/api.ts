import { Request, Response } from 'express';

export let getApi = (_: Request, res: Response) => {
  res.send({
    content: 'hello world',
  });
};

export type RequestMatcherFunction<TProps = { [prop: string]: any }> = (request: Request, props: TProps) => boolean;
export interface RequestMatcherFunctionMap { [requestMatcherKindId: string]: RequestMatcherFunction; }

export const requestMatcherFunctions: RequestMatcherFunctionMap = {};

export interface Request {

}
