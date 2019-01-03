import { Request, RequestHandler, Response } from 'express';
import validate from 'validate.js';
import { failure, isFailure, isSuccess, Result, success } from '../util/result-monad';

export type CommandValidationErrors = string[];
export type CommandValidationFn<TCommand, TParams = never> =
  (command: TCommand, params: TParams) => Result<never, CommandValidationErrors> | Promise<Result<never, CommandValidationErrors>>;

export interface ValidationConstraint<T> {
  presence?: boolean;
  exclusion?: { within: T[]; message?: string };
}

export type CommandValidationConstraints<TCommand, TParams = never> = {
  [prop in keyof TCommand | keyof TParams]: ValidationConstraint<(TCommand & TParams)[prop]>;
};

export type CommandValidator<TCommand, TParams = never> = CommandValidationFn<TCommand, TParams> | CommandValidationConstraints<TCommand, TParams>;

// TODO: move to utils
function keys<T>(t: T): (keyof T)[] {
  return Object.keys(t) as (keyof T)[];
}

export function evaluateCommandValidationMap<TCommand, TParams = never>(
  constraints: CommandValidationConstraints<TCommand, TParams>,
  command: TCommand,
  params: TParams,
): Result<never, CommandValidationErrors> {
  const commandAndParams = { ...command, ...params };
  const messages: string[] = validate(commandAndParams, constraints, { format: 'flat' }) || [];

  keys(commandAndParams).filter(key => !constraints[key]).forEach(key => messages.push(`${key} is not a valid property on this type of command`));

  return messages.length > 0 ? failure(messages) : success();
}

export function commandHandler<TCommand, TParams = never, TSuccess = never, TFailure = never>(
  handler: (command: TCommand, params: TParams) => Result<TSuccess, TFailure> | Promise<Result<TSuccess, TFailure>>,
  validator?: CommandValidator<TCommand, TParams>,
): RequestHandler {
  return async (req: Request, res: Response) => {
    const command = req.body as TCommand;
    const params = { ...req.params, ...req.query } as TParams;

    if (validator) {
      const validationResult = typeof validator === 'function'
        ? await validator(command, params)
        : evaluateCommandValidationMap(validator, command, params);

      if (isFailure(validationResult)) {
        res.status(400).send(validationResult.payload);
        return;
      }
    }

    const result = await handler(command, params);
    res.status(isSuccess(result) ? result.payload ? 200 : 204 : 400).send(result.payload);
  };
}

export function queryHandler<TParams = never, TSuccess = never, TFailure = never>(
  handler: (params: TParams) => Result<TSuccess, TFailure> | Promise<Result<TSuccess, TFailure>>,
): RequestHandler {
  return async (req: Request, res: Response) => {
    const result = await handler({ ...req.params, ...req.query });
    res.status(isSuccess(result) ? result.payload ? 200 : 204 : 400).send(result.payload);
  };
}
