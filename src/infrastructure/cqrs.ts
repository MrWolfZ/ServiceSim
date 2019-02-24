import { query, registerCommandHandler, send } from 'src/infrastructure/bus';
import { failure, keys, Result, success } from 'src/util';
import validate from 'validate.js';

export type CommandHandler<TCommand extends Command<TCommand['commandType'], TCommand['@return']>> =
  (command: TCommand) => NonUndefined<TCommand['@return']> | Promise<NonUndefined<TCommand['@return']>>;

export type QueryHandler<TQuery extends Query<TQuery['queryType'], TQuery['@return']>> =
  (query: TQuery) => NonUndefined<TQuery['@return']> | Promise<NonUndefined<TQuery['@return']>>;

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
  keys(command)
    .filter(key => key !== 'commandType' && key !== 'occurredOnEpoch')
    .filter(key => !(constraints as any)[key])
    .forEach(key => messages.push(`${key} is not a valid property on this type of command`));

  return messages.length > 0 ? failure(messages) : success();
}

export type CommandInterceptor = <TCommand extends Command<TCommand['commandType'], TCommand['@return']>>(
  command: TCommand,
  next: (command: TCommand) => Promise<NonUndefined<TCommand['@return']>>,
) => Promise<NonUndefined<TCommand['@return']>>;

export type QueryInterceptor = <TQuery extends Query<TQuery['queryType'], TQuery['@return']>>(
  query: TQuery,
  next: (query: TQuery) => Promise<NonUndefined<TQuery['@return']>>,
) => Promise<NonUndefined<TQuery['@return']>>;

export interface Command<TCommandType extends string, TReturn = void> {
  commandType: TCommandType;
  occurredOnEpoch: number;
  '@return'?: TReturn;
}

export function createCommand<TCommand extends Command<TCommand['commandType'], TCommand['@return']>>(
  commandType: TCommand['commandType'],
) {
  return (
    customProps: Omit<TCommand, keyof Command<TCommand['commandType'], TCommand['@return']>>,
  ): TCommand => {
    const commandProps: Command<TCommand['commandType'], TCommand['@return']> = {
      commandType,
      occurredOnEpoch: Date.now(),
    };

    return {
      ...commandProps,
      ...customProps as any,
    };
  };
}

export function createCommandFn<TCommand extends Command<TCommand['commandType'], TCommand['@return']>>(
  commandType: TCommand['commandType'],
) {
  return async (
    customProps: Omit<TCommand, keyof Command<TCommand['commandType'], TCommand['@return']>>,
  ) => {
    const cmd = createCommand<TCommand>(commandType)(customProps);
    return await send<TCommand>(cmd);
  };
}

export function createAndRegisterCommandHandler<TCommand extends Command<TCommand['commandType'], TCommand['@return']>>(
  commandType: TCommand['commandType'],
  handler: CommandHandler<TCommand>,
) {
  // we intentionally ignore the unsub callback here since this method is supposed to be called
  // to globally and statically register the command handler without ever unregistering it
  registerCommandHandler(commandType, handler);
  return createCommandFn(commandType);
}

export interface Query<TQueryType extends string, TReturn> {
  queryType: TQueryType;
  occurredOnEpoch: number;
  '@return'?: TReturn;
}

export function createQuery<TQuery extends Query<TQuery['queryType'], TQuery['@return']>>(
  queryType: TQuery['queryType'],
) {
  return <TCustomProps extends Omit<TQuery, keyof Query<TQuery['queryType'], TQuery['@return']>>>(
    customProps: TCustomProps & Exact<Omit<TQuery, keyof Query<TQuery['queryType'], TQuery['@return']>>, TCustomProps>,
  ): TQuery => {
    const queryProps: Query<TQuery['queryType'], TQuery['@return']> = {
      queryType,
      occurredOnEpoch: Date.now(),
    };

    return {
      ...queryProps,
      ...customProps as any,
    };
  };
}

export function createQueryFn<TQuery extends Query<TQuery['queryType'], TQuery['@return']>>(
  queryType: TQuery['queryType'],
) {
  return async <TCustomProps extends Omit<TQuery, keyof Query<TQuery['queryType'], TQuery['@return']>>>(
    customProps: TCustomProps & Exact<Omit<TQuery, keyof Query<TQuery['queryType'], TQuery['@return']>>, TCustomProps>,
  ) => {
    const q = createQuery<TQuery>(queryType)(customProps);
    return await query<TQuery>(q);
  };
}
