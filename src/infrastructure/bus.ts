import { Command, Query } from 'src/application/infrastructure/cqrs';
import { DomainEvent, Event } from 'src/domain/infrastructure/ddd';
import { failure, isFailure } from 'src/util';
import { CommandHandler, CommandInterceptor, CommandValidator, evaluateCommandValidationConstraints, QueryHandler, QueryInterceptor } from './cqrs';

interface CommandHandlerDefinition<TCommand extends Command<TCommand['commandType'], TCommand['@return']>> {
  handler: CommandHandler<TCommand>;
  validators: CommandValidator<TCommand>[];
}

const commandHandlers: { [commandType: string]: CommandHandlerDefinition<any> } = {};

const commandInterceptors: CommandInterceptor[] = [];

const queryHandlers: { [queryType: string]: QueryHandler<any> } = {};

const queryInterceptors: QueryInterceptor[] = [];

export type EventHandler<TEvent extends Event<TEvent['eventType']>> = (event: TEvent) => void | Promise<void>;

const eventHandlers: { [eventType: string]: EventHandler<any>[] } = {};

const domainEventHandlers: { [aggregateType: string]: { [eventType: string]: EventHandler<any>[] } } = {};

const universalDomainEventHandlers: { [aggregateType: string]: EventHandler<any>[] } = {};

const universalEventHandlers: EventHandler<any>[] = [];

export async function send<TCommand extends Command<TCommand['commandType'], TCommand['@return']>>(command: TCommand) {
  const handlerDef = commandHandlers[command.commandType as string] as CommandHandlerDefinition<TCommand>;

  if (!handlerDef) {
    throw failure(`there is no command handler registered for command type ${command.commandType}!`);
  }

  const validationMessages: string[] = [];

  for (const validator of handlerDef.validators) {
    if (typeof validator === 'function') {
      const validationResult = await validator(command);

      if (isFailure(validationResult)) {
        validationMessages.push(...validationResult.failure);
      }
    } else {
      const validationResult = evaluateCommandValidationConstraints(validator, command);

      if (isFailure(validationResult)) {
        validationMessages.push(...validationResult.failure);
      }
    }
  }

  if (validationMessages.length > 0) {
    throw failure(validationMessages);
  }

  const handlerInterceptor: CommandInterceptor = async cmd => await handlerDef.handler(cmd as any as TCommand) as any;

  const chain = [...commandInterceptors, handlerInterceptor];

  return await executeChain(command, chain);

  async function executeChain(cmd: TCommand, chain: CommandInterceptor[]): Promise<NonUndefined<TCommand['@return']>> {
    const [first, ...rest] = chain;
    return await first(cmd, c => executeChain(c, rest));
  }
}

export async function sendMany<TCommand extends Command<TCommand['commandType'], TCommand['@return']>>(...commands: TCommand[]) {
  return await Promise.all(commands.map(send));
}

export async function query<TQuery extends Query<TQuery['queryType'], TQuery['@return']>>(query: TQuery) {
  const handler = queryHandlers[query.queryType as string] as QueryHandler<TQuery>;

  if (!handler) {
    throw failure(`there is no query handler registered for query type ${query.queryType}!`);
  }

  const handlerInterceptor: QueryInterceptor = async q => await handler(q as any as TQuery) as any;

  const chain = [...queryInterceptors, handlerInterceptor];

  return await executeChain(query, chain);

  async function executeChain(query: TQuery, chain: QueryInterceptor[]): Promise<NonUndefined<TQuery['@return']>> {
    const [first, ...rest] = chain;
    return await first(query, q => executeChain(q, rest));
  }
}

export async function queryMany<TQuery extends Query<TQuery['queryType'], TQuery['@return']>>(...queries: TQuery[]) {
  return await Promise.all(queries.map(query));
}

export async function publish<TEvent extends Event<TEvent['eventType']> = Event<TEvent['eventType']>>(...events: TEvent[]) {
  for (const event of events) {
    const handlers = (eventHandlers[event.eventType] || []) as EventHandler<TEvent>[];

    handlers.push(...universalEventHandlers);

    if (isDomainEvent(event)) {
      const aggregateTypeHandlers = universalDomainEventHandlers[event.aggregateType] || [];
      handlers.push(...aggregateTypeHandlers);

      const aggregateAndEventTypeHandlers = (domainEventHandlers[event.aggregateType] || {})[event.eventType as string] || [];
      handlers.push(...aggregateAndEventTypeHandlers);
    }

    for (const handler of handlers) {
      await handler(event);
    }
  }

  function isDomainEvent<T extends string>(event: Event<T>): event is DomainEvent<any, T> {
    return !!(event as DomainEvent<any, T>).aggregateType;
  }
}

export function registerCommandHandler<TCommand extends Command<TCommand['commandType'], TCommand['@return']>>(
  commandType: TCommand['commandType'],
  handler: CommandHandler<TCommand>,
  ...validators: CommandValidator<TCommand>[]
) {
  if (!!commandHandlers[commandType]) {
    throw failure(`there already is a command handler registered for command type ${commandType}!`);
  }

  commandHandlers[commandType as any] = {
    handler,
    validators,
  };

  return () => {
    delete commandHandlers[commandType];
  };
}

export function registerQueryHandler<TQuery extends Query<TQuery['queryType'], TQuery['@return']>>(
  queryType: TQuery['queryType'],
  handler: QueryHandler<TQuery>,
) {
  if (!!queryHandlers[queryType]) {
    throw failure(`there already is a query handler registered for query type ${queryType}!`);
  }

  queryHandlers[queryType as any] = handler;

  return () => {
    delete queryHandlers[queryType];
  };
}

export function registerEventHandler<TEvent extends Event<TEvent['eventType']>>(
  eventType: TEvent['eventType'],
  handler: EventHandler<TEvent>,
) {
  const handlers = eventHandlers[eventType as string] = eventHandlers[eventType as string] || [];
  handlers.push(handler);

  return () => {
    handlers.splice(handlers.indexOf(handler), 1);
  };
}

export function registerDomainEventHandler<TEvent extends DomainEvent<TEvent['aggregateType'], TEvent['eventType']>>(
  aggregateType: TEvent['aggregateType'],
  eventType: TEvent['eventType'],
  handler: EventHandler<TEvent>,
) {
  const aggregateHandlers = domainEventHandlers[aggregateType as string] = domainEventHandlers[aggregateType as string] || {};
  const handlers = aggregateHandlers[eventType as string] = aggregateHandlers[eventType as string] || [];
  handlers.push(handler);

  return () => {
    handlers.splice(handlers.indexOf(handler), 1);
  };
}

export function registerUniversalDomainEventHandler<TEvent extends DomainEvent<TEvent['aggregateType'], TEvent['eventType']>>(
  aggregateType: TEvent['aggregateType'],
  handler: EventHandler<TEvent>,
) {
  const handlers = universalDomainEventHandlers[aggregateType as string] = universalDomainEventHandlers[aggregateType as string] || [];
  handlers.push(handler);

  return () => {
    handlers.splice(handlers.indexOf(handler), 1);
  };
}

export function registerUniversalEventHandler(handler: EventHandler<Event<any>>) {
  universalEventHandlers.push(handler);

  return () => {
    universalEventHandlers.splice(universalEventHandlers.indexOf(handler), 1);
  };
}

export function registerCommandInterceptor(
  interceptor: CommandInterceptor,
) {
  commandInterceptors.push(interceptor);

  return () => {
    commandInterceptors.splice(commandInterceptors.indexOf(interceptor), 1);
  };
}

export function registerQueryInterceptor(
  interceptor: QueryInterceptor,
) {
  queryInterceptors.push(interceptor);

  return () => {
    queryInterceptors.splice(queryInterceptors.indexOf(interceptor), 1);
  };
}
