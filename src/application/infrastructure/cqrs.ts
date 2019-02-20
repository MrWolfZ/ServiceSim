import { query, registerCommandHandler as registerCommandHandlerInBus, send } from 'src/infrastructure/bus';
import { CommandHandler } from 'src/infrastructure/cqrs';

export interface Command<TCommandType extends string, TReturn = void> {
  commandType: TCommandType;
  occurredOnEpoch: number;
  '@return'?: TReturn;
}

export function createCommand<TCommand extends Command<TCommand['commandType'], TCommand['@return']>>(
  commandType: TCommand['commandType'],
) {
  return <TCustomProps extends Omit<TCommand, keyof Command<TCommand['commandType'], TCommand['@return']>>>(
    customProps: TCustomProps & Exact<Omit<TCommand, keyof Command<TCommand['commandType'], TCommand['@return']>>, TCustomProps>,
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
  return async <TCustomProps extends Omit<TCommand, keyof Command<TCommand['commandType'], TCommand['@return']>>>(
    customProps: TCustomProps & Exact<Omit<TCommand, keyof Command<TCommand['commandType'], TCommand['@return']>>, TCustomProps>,
  ) => {
    const cmd = createCommand<TCommand>(commandType)(customProps);
    return await send<TCommand>(cmd);
  };
}

export function registerCommandHandler<TCommand extends Command<TCommand['commandType'], TCommand['@return']>>(
  commandType: TCommand['commandType'],
  handler: CommandHandler<TCommand>,
) {
  // we intentionally ignore the unsub callback here since this method is supposed to be called
  // to globally and statically register the command handler without ever unregistering it
  registerCommandHandlerInBus(commandType, handler);
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
