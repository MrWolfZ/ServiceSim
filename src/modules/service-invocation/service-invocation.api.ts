import { CommandHandler, createDomainEvent, DB } from '../../api-infrastructure';
import { failure, isFailure } from '../../util/result-monad';
import { omit } from '../../util/util';
import {
  CreateServiceInvocationCommand,
  ServiceInvocationEntityDefinition,
  SetServiceResponseCommand,
} from './service-invocation.types';

export const SERVICE_INVOCATION_ENTITY_DEFINITION: ServiceInvocationEntityDefinition = {
  entityType: 'service-invocation',
  '@': 'EventDrivenRootEntityDefinition',
  eventHandlers: {
    InvocationResponseWasSet: (entity, evt) => {
      return {
        ...entity,
        response: {
          statusCode: evt.statusCode,
          body: evt.body,
          contentType: evt.contentType,
        },
      };
    },
  },
};

type ServiceInvocationCommandHandler<TCommand> = CommandHandler<TCommand, {
  invocationId: string;
  invocationVersion: number;
}>;

export const createAsync: ServiceInvocationCommandHandler<CreateServiceInvocationCommand> = async command => {
  const newInvocation = await DB.createAsync(SERVICE_INVOCATION_ENTITY_DEFINITION, {
    state: 'processing pending',
    request: {
      path: command.path,
      body: command.body,
    },
    response: undefined,
  });

  return {
    invocationId: newInvocation.id,
    invocationVersion: newInvocation.$metadata.version,
  };
};

// TODO: validate
createAsync.constraints = {
  path: {},
  body: {},
};

export const setServiceResponseAsync: ServiceInvocationCommandHandler<SetServiceResponseCommand> = async command => {
  const invocationResult = await DB.query(SERVICE_INVOCATION_ENTITY_DEFINITION).byIdAsync(command.invocationId);

  if (isFailure(invocationResult)) {
    return invocationResult;
  }

  const invocation = invocationResult.success;

  if (invocation.response) {
    return failure([`Cannot set response for service invocation ${invocation.id} since it already has a response!`]);
  }

  const result = await DB.patchAsync(
    SERVICE_INVOCATION_ENTITY_DEFINITION,
    command.invocationId,
    command.unmodifiedInvocationVersion,
    {},
    createDomainEvent(
      SERVICE_INVOCATION_ENTITY_DEFINITION,
      'InvocationResponseWasSet',
      {
        rootEntityId: command.invocationId,
        ...omit(command, 'invocationId', 'unmodifiedInvocationVersion'),
      },
    ),
  );

  if (isFailure(result)) {
    return result;
  }

  return {
    invocationId: command.invocationId,
    invocationVersion: result.success,
  };
};

// TODO: validate
setServiceResponseAsync.constraints = {
  invocationId: {},
  unmodifiedInvocationVersion: {},
  statusCode: {},
  body: {},
  contentType: {},
};

export const dropAllAsync: CommandHandler = async () => {
  await DB.dropAllAsync(SERVICE_INVOCATION_ENTITY_DEFINITION.entityType);
};
