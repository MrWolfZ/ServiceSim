import { Request, RequestHandler, Response } from 'express';
import validate from 'validate.js';
import { failure, isFailure, isResult, isSuccess, Result, success } from '../util/result-monad';
import { keys } from '../util/util';

export type CommandValidationFn<TCommand> = (command: TCommand) => Result<never, string[]> | Promise<Result<never, string[]>>;

export interface ValidationConstraint<T> {
  presence?: boolean;
  exclusion?: { within: T[]; message?: string };
}

export type CommandValidationConstraints<TCommand> = {
  [prop in keyof TCommand]: ValidationConstraint<TCommand[prop]>;
};

export type CommandValidator<TCommand> = CommandValidationFn<TCommand> | CommandValidationConstraints<TCommand>;

export function evaluateCommandValidationConstraints<TCommand>(
  constraints: CommandValidationConstraints<TCommand>,
  command: TCommand,
): Result<never, string[]> {
  const messages: string[] = validate(command, constraints, { format: 'flat' }) || [];
  keys(command).filter(key => !constraints[key]).forEach(key => messages.push(`${key} is not a valid property on this type of command`));
  return messages.length > 0 ? failure(messages) : success();
}

export interface CommandHandler<TCommand, TSuccess = void> {
  (command: TCommand): TSuccess | Promise<TSuccess> | Result<TSuccess, string[]> | Promise<Result<TSuccess, string[]>>;
  validationFn?: CommandValidationFn<TCommand>;
  constraints?: CommandValidationConstraints<TCommand>;
}

export function commandHandler<TCommand, TSuccess = void>(
  handler: CommandHandler<TCommand, TSuccess>,
): RequestHandler {
  return async (req: Request, res: Response) => {
    try {
      const command = req.body as TCommand;

      const validationMessages: string[] = [];

      if (handler.validationFn) {
        const validationResult = await handler.validationFn(command);

        if (isFailure(validationResult)) {
          validationMessages.push(...validationResult.failure);
        }
      }

      if (handler.constraints) {
        const validationResult = evaluateCommandValidationConstraints(handler.constraints, command);

        if (isFailure(validationResult)) {
          validationMessages.push(...validationResult.failure);
        }
      }

      if (validationMessages.length > 0) {
        res.status(400).send(validationMessages);
        return;
      }

      let result = await handler(command);
      result = isResult<TSuccess, string[]>(result) ? result : success(result);

      if (isSuccess(result)) {
        res.status(result.success ? 200 : 204).send(result.success);
      } else {
        res.status(400).send(result.failure);
      }
    } catch (error) {
      res.status(500).send({ error });
    }
  };
}

export function queryHandler<TParams = never, TSuccess = void, TFailure = never>(
  handler: (params: TParams) => TSuccess | Promise<TSuccess> | Result<TSuccess, TFailure> | Promise<Result<TSuccess, TFailure>>,
): RequestHandler {
  return async (req: Request, res: Response) => {
    try {
      let result = await handler({ ...req.params, ...req.query });
      result = isResult<TSuccess, TFailure>(result) ? result : success(result);

      if (isSuccess(result)) {
        res.status(result.success ? 200 : 204).send(result.success);
      } else {
        res.status(400).send(result.failure);
      }
    } catch (error) {
      res.status(500).send({ error });
    }
  };
}
