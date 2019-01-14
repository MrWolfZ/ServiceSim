import { eventDrivenRepository } from '../../api-infrastructure';
import { failure, omit } from '../../util';
import {
  CreateServiceInvocationCommand,
  ServiceInvocationAggregate,
  ServiceInvocationDomainEvents,
  SetServiceResponseCommand,
} from './service-invocation.types';

const repo = eventDrivenRepository<ServiceInvocationAggregate, ServiceInvocationDomainEvents>('service-invocation', {
  InvocationResponseWasSet: (aggregate, evt) => {
    return {
      ...aggregate,
      response: {
        statusCode: evt.statusCode,
        body: evt.body,
        contentType: evt.contentType,
      },
    };
  },
});

export async function createServiceInvocation(command: CreateServiceInvocationCommand) {
  const newInvocation = await repo.create({
    state: 'processing pending',
    request: {
      path: command.path,
      body: command.body,
    },
    response: undefined,
  });

  return {
    invocationId: newInvocation.id,
    invocationVersion: 1,
  };
}

// TODO: validate
createServiceInvocation.constraints = {
  path: {},
  body: {},
};

export async function setServiceInvocationResponse(command: SetServiceResponseCommand) {
  const invocation = await repo.query.byId(command.invocationId);

  if (invocation.response) {
    throw failure(`Cannot set response for service invocation ${invocation.id} since it already has a response!`);
  }

  const newVersion = await repo.patch(
    command.invocationId,
    command.unmodifiedInvocationVersion,
    {},
    repo.createDomainEvent(
      'InvocationResponseWasSet',
      {
        aggregateId: command.invocationId,
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
  await repo.dropAll();
}
