import { createDomainEvent, DB } from '../../api-infrastructure';
import { failure } from '../../util/result-monad';
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

export async function createServiceInvocation(command: CreateServiceInvocationCommand) {
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
}

// TODO: validate
createServiceInvocation.constraints = {
  path: {},
  body: {},
};

export async function setServiceInvocationResponse(command: SetServiceResponseCommand) {
  const invocation = await DB.query(SERVICE_INVOCATION_ENTITY_DEFINITION).byIdAsync(command.invocationId);

  if (invocation.response) {
    throw failure(`Cannot set response for service invocation ${invocation.id} since it already has a response!`);
  }

  const newVersion = await DB.patchAsync(
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

  return {
    invocationId: command.invocationId,
    invocationVersion: newVersion,
  };
}

// TODO: validate
setServiceInvocationResponse.constraints = {
  invocationId: {},
  unmodifiedInvocationVersion: {},
  statusCode: {},
  body: {},
  contentType: {},
};

export async function dropAllServiceInvocations() {
  await DB.dropAllAsync(SERVICE_INVOCATION_ENTITY_DEFINITION.entityType);
}
