import { Command, Query } from 'src/application/infrastructure/cqrs';
import { failure, keys, Result, success } from 'src/util';
import validate from 'validate.js';

export type CommandHandler<TCommand extends Command<TCommand['commandType'], TCommand['@return']>> =
  (command: TCommand) => NonNullable<TCommand['@return']> | Promise<NonNullable<TCommand['@return']>>;

export type QueryHandler<TQuery extends Query<TQuery['queryType'], TQuery['@return']>> =
  (query: TQuery) => NonNullable<TQuery['@return']> | Promise<NonNullable<TQuery['@return']>>;

export type CommandValidationFn<TCommand> = (command: TCommand) => Result<void, string[]> | Promise<Result<void, string[]>>;

export interface ValidationConstraint<T> {
  presence?: boolean;
  exclusion?: { within: T[]; message?: string };
}

export type CommandValidationConstraints<TCommand> = {
  [prop in keyof Omit<TCommand, keyof Command<any>>]: ValidationConstraint<TCommand[prop]>;
};

export type CommandValidator<TCommand> = CommandValidationFn<TCommand> | CommandValidationConstraints<TCommand>;

export function evaluateCommandValidationConstraints<TCommand>(
  constraints: CommandValidationConstraints<TCommand>,
  command: TCommand,
): Result<void, string[]> {
  const messages: string[] = validate(command, constraints, { format: 'flat' }) || [];
  keys(command).filter(key => !(constraints as any)[key]).forEach(key => messages.push(`${key} is not a valid property on this type of command`));
  return messages.length > 0 ? failure(messages) : success();
}
