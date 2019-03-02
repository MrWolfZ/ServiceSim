import { Event } from 'src/domain/infrastructure/ddd';
import { publish, query, registerCommandHandler, registerQueryHandler, send } from 'src/infrastructure/bus';
import { generateId } from 'src/util/id';
import { failure, Result, success } from 'src/util/result-monad';
import { keys } from 'src/util/util';
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
    .filter(key => key !== 'commandId' && key !== 'commandType' && key !== 'occurredOnEpoch')
    .filter(key => !(constraints as any)[key])
    .forEach(key => messages.push(`${key} is not a valid property on this type of command`));

  return messages.length > 0 ? failure(messages) : success();
}

export interface CommandHandlerReturnValueWithEvents<TCommand extends Command<TCommand['commandType'], TCommand['@return']>> {
  returnValue: NonUndefined<TCommand['@return']>;
  events: Event<any>[];
}

export type CommandHandlerReturnValue<TCommand extends Command<TCommand['commandType'], TCommand['@return']>> =
  Promise<NonUndefined<TCommand['@return']> | CommandHandlerReturnValueWithEvents<TCommand>>;

export type CommandInterceptor = <TCommand extends Command<TCommand['commandType'], TCommand['@return']>>(
  command: TCommand,
  next: (command: TCommand, ...events: Event<any>[]) => CommandHandlerReturnValue<TCommand>,
) => CommandHandlerReturnValue<TCommand>;

export type QueryInterceptor = <TQuery extends Query<TQuery['queryType'], TQuery['@return']>>(
  query: TQuery,
  next: (query: TQuery) => Promise<NonUndefined<TQuery['@return']>>,
) => Promise<NonUndefined<TQuery['@return']>>;

export interface Command<TCommandType extends string, TReturn = void> {
  commandId: string;
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
      commandId: generateId(21),
      commandType,
      occurredOnEpoch: Date.now(),
    };

    return {
      ...commandProps,
      ...customProps as any,
    };
  };
}

export type CommandFn<TCommand extends Command<TCommand['commandType'], TCommand['@return']>> =
  Command<TCommand['commandType'], TCommand['@return']> extends TCommand
  ? () => Promise<NonUndefined<TCommand['@return']>>
  : (customProps: Omit<TCommand, keyof Command<TCommand['commandType'], TCommand['@return']>>) => Promise<NonUndefined<TCommand['@return']>>;

export function createCommandFn<TCommand extends Command<TCommand['commandType'], TCommand['@return']>>(
  commandType: TCommand['commandType'],
): CommandFn<TCommand> {
  const fn = async (
    customProps?: Omit<TCommand, keyof Command<TCommand['commandType'], TCommand['@return']>>,
  ): Promise<NonUndefined<TCommand['@return']>> => {
    const cmd = createCommand<TCommand>(commandType)(customProps || ({} as any));
    const result = await send<TCommand>(cmd);

    const returnValue = (result as CommandHandlerReturnValueWithEvents<TCommand>).returnValue || (result as NonUndefined<TCommand['@return']>);
    const events = (result as CommandHandlerReturnValueWithEvents<TCommand>).events || [];
    await publish(...events);
    return returnValue;
  };

  return fn as any;
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
  return (
    customProps: Omit<TQuery, keyof Query<TQuery['queryType'], TQuery['@return']>>,
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

export type QueryFn<TQuery extends Query<TQuery['queryType'], TQuery['@return']>> =
  Query<TQuery['queryType'], TQuery['@return']> extends TQuery
  ? () => Promise<NonUndefined<TQuery['@return']>>
  : (customProps: Omit<TQuery, keyof Query<TQuery['queryType'], TQuery['@return']>>) => Promise<NonUndefined<TQuery['@return']>>;

export function createQueryFn<TQuery extends Query<TQuery['queryType'], TQuery['@return']>>(
  queryType: TQuery['queryType'],
): QueryFn<TQuery> {
  const fn = async (
    customProps?: Omit<TQuery, keyof Query<TQuery['queryType'], TQuery['@return']>>,
  ) => {
    const q = createQuery<TQuery>(queryType)(customProps || ({} as any));
    return await query<TQuery>(q);
  };

  return fn as any;
}

export function createAndRegisterQueryHandler<TQuery extends Query<TQuery['queryType'], TQuery['@return']>>(
  queryType: TQuery['queryType'],
  handler: QueryHandler<TQuery>,
) {
  // we intentionally ignore the unsub callback here since this method is supposed to be called
  // to globally and statically register the query handler without ever unregistering it
  registerQueryHandler(queryType, handler);
  return createQueryFn(queryType);
}
