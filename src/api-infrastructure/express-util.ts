import { Request, RequestHandler, Response } from 'express';
import { isResult, isSuccess, Result } from '../util/result-monad';

export function requestHandler<TResponse>(handler: () => TResponse): RequestHandler;

export function requestHandler<TRequest, TSuccess = never, TFailure = never>(
  handler: (req: TRequest) => Promise<Result<TSuccess, TFailure>>,
): RequestHandler;

export function requestHandler<TRequest, TParams, TSuccess = never, TFailure = never>(
  handler: (req: TRequest, params: TParams) => Promise<Result<TSuccess, TFailure>>,
): RequestHandler;

export function requestHandler<TRequest, TSuccess = never, TFailure = never>(
  handler: (req: TRequest) => Result<TSuccess, TFailure>,
): RequestHandler;

export function requestHandler<TRequest, TParams, TSuccess = never, TFailure = never>(
  handler: (req: TRequest, params: TParams) => Result<TSuccess, TFailure>,
): RequestHandler;

export function requestHandler<TRequest, TResponse = void>(
  handler: (req: TRequest) => Promise<TResponse>,
): RequestHandler;

export function requestHandler<TRequest, TParams, TResponse = void>(
  handler: (req: TRequest, params: TParams) => Promise<TResponse>,
): RequestHandler;

export function requestHandler<TRequest, TResponse = void>(
  handler: (req: TRequest) => TResponse,
): RequestHandler;

export function requestHandler<TRequest, TParams, TResponse = void>(
  handler: (req: TRequest, params: TParams) => TResponse,
): RequestHandler;

export function requestHandler<TRequest = {}, TParams = {}, TResponse = void, TSuccess = never, TFailure = never>(
  handler: (req?: TRequest, params?: TParams) => TResponse | Promise<TResponse> | Result<TSuccess, TFailure> | Promise<Result<TSuccess, TFailure>>
): RequestHandler {
  return async (req: Request, res: Response) => {
    const result = await Promise.resolve<any>(handler(Object.keys(req.body).length > 0 ? req.body : req.params, req.params));
    if (isResult<TSuccess, TFailure>(result)) {
      if (isSuccess(result)) {
        res.status(result.success ? 200 : 204).send(result.success);
      } else {
        res.status(400).send(result.failure);
      }
    } else {
      res.status(result ? 200 : 204).send(result);
    }
  };
}
