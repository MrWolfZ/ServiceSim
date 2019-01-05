import express from 'express';
import { commandHandler, CommandHandler, DB, queryHandler } from '../../api-infrastructure';
import { failure, isFailure } from '../../util/result-monad';
import { keys, omit } from '../../util/util';
import * as DEFAULT_TEMPLATES from './default-templates';
import {
  CommandResponse as PredicateTemplateCommandResponse,
  CreatePredicateTemplateCommand,
  DeletePredicateTemplateCommand,
  PredicateTemplateDto,
  PredicateTemplateEntityDefinition,
  UpdatePredicateTemplateCommand,
} from './predicate-template.types';

export const PREDICATE_TEMPLATE_ENTITY_DEFINITION: PredicateTemplateEntityDefinition = {
  entityType: 'predicate-template',
  '@': 'VersionedRootEntityDefinition',
};

export async function getAllAsync() {
  const allTemplates = await DB.queryVersion(PREDICATE_TEMPLATE_ENTITY_DEFINITION).allLatestAsync();

  return allTemplates.map<PredicateTemplateDto>(t => ({
    id: t.id,
    version: t.$metadata.version,
    name: t.name,
    description: t.description,
    evalFunctionBody: t.evalFunctionBody,
    parameters: t.parameters,
  }));
}

type PredicateTemplateCommandHandler<TCommand> = CommandHandler<TCommand, PredicateTemplateCommandResponse>;

export const createAsync: PredicateTemplateCommandHandler<CreatePredicateTemplateCommand> = async command => {
  const template = await DB.createVersionAsync(PREDICATE_TEMPLATE_ENTITY_DEFINITION, command);

  return {
    templateId: template.id,
    templateVersion: template.$metadata.version,
  };
};

// TODO: validate
createAsync.constraints = {
  name: {},
  description: {},
  evalFunctionBody: {},
  parameters: {},
};

export const updateAsync: PredicateTemplateCommandHandler<UpdatePredicateTemplateCommand> = async command => {
  const result = await DB.patchVersionAsync(
    PREDICATE_TEMPLATE_ENTITY_DEFINITION,
    command.templateId,
    command.unmodifiedTemplateVersion,
    omit(command, 'templateId', 'unmodifiedTemplateVersion'),
  );

  if (isFailure(result)) {
    return result;
  }

  return {
    templateId: result.success.id,
    templateVersion: result.success.$metadata.version,
  };
};

// TODO: validate
updateAsync.constraints = {
  templateId: {},
  unmodifiedTemplateVersion: {},
  name: {},
  description: {},
  evalFunctionBody: {},
  parameters: {},
};

export const deleteAsync: CommandHandler<DeletePredicateTemplateCommand> = async command => {
  await DB.deleteVersionAsync(PREDICATE_TEMPLATE_ENTITY_DEFINITION, command.templateId, command.unmodifiedTemplateVersion);
};

// TODO: validate
deleteAsync.constraints = {
  templateId: {},
  unmodifiedTemplateVersion: {},
};

export const dropAllAsync: CommandHandler = async () => {
  await DB.dropAllAsync(PREDICATE_TEMPLATE_ENTITY_DEFINITION.entityType);
};

export const createDefaultTemplatesAsync: CommandHandler = async () => {
  const failureMessages: string[] = [];

  for (const key of keys(DEFAULT_TEMPLATES)) {
    const result = await createAsync(DEFAULT_TEMPLATES[key]);

    if (isFailure(result)) {
      failureMessages.push(...result.failure);
    }
  }

  if (failureMessages.length > 0) {
    return failure(failureMessages);
  }
};

export const api = express.Router();
api.get('/', queryHandler(getAllAsync));
api.post('/create', commandHandler(createAsync));
api.post('/update', commandHandler(updateAsync));
api.post('/delete', commandHandler(deleteAsync));
