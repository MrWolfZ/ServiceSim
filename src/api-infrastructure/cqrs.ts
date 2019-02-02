import { Request, RequestHandler, Response } from 'express';
import { CONFIG } from 'src/infrastructure/config';
import { CommandValidationConstraints, CommandValidationFn, evaluateCommandValidationConstraints } from 'src/infrastructure/cqrs';
import { isFailure } from '../util';

export interface ErrorResponsePayload {
  messages: string[];
  stackTrace?: string;
}

export function commandHandler<TCommand = void, TResult = void>(
  handler: (command: TCommand) => TResult | Promise<TResult>,
  constraints?: CommandValidationConstraints<TCommand>,
  validationFn?: CommandValidationFn<TCommand>,
): RequestHandler {
  return async (req: Request, res: Response) => {
    try {
      const command = req.body as TCommand;

      const validationMessages: string[] = [];

      if (validationFn) {
        const validationResult = await validationFn(command);

        if (isFailure(validationResult)) {
          validationMessages.push(...validationResult.failure);
        }
      }

      if (constraints) {
        const validationResult = evaluateCommandValidationConstraints(constraints, command);

        if (isFailure(validationResult)) {
          validationMessages.push(...validationResult.failure);
        }
      }

      if (validationMessages.length > 0) {
        res.status(400).send(validationMessages);
        return;
      }

      const result = await handler(command);
      res.status(result ? 200 : 204).send(result);
    } catch (error) {
      writeErrorResponse(res, error);
    }
  };
}

export function queryHandler<TParams = never, TResult = void>(
  handler: (params: TParams) => TResult | Promise<TResult>,
): RequestHandler {
  return async (req: Request, res: Response) => {
    try {
      const result = await handler({ ...req.params, ...req.query });
      res.status(result ? 200 : 204).send(result);
    } catch (error) {
      writeErrorResponse(res, error);
    }
  };
}

export function writeErrorResponse(res: Response, error: any) {
  const isProduction = CONFIG.environment === 'production';

  let statusCode = 500;
  let messages: string[] = [isProduction ? 'an unknown error occured' : JSON.stringify(error)];
  let stackTrace: string | undefined;

  if (isFailure<string | string[]>(error)) {
    statusCode = 400;
    messages = Array.isArray(error.failure) ? error.failure : [error.failure];
    stackTrace = error.stackTrace;
  }

  if (error instanceof Error) {
    messages = [error.message];
    stackTrace = error.stack;
  }

  const payload: ErrorResponsePayload = {
    messages,
  };

  if (!isProduction) {
    payload.stackTrace = stackTrace;
  }

  res.status(statusCode).send(payload);
}
