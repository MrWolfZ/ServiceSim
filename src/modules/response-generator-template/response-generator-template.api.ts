import express from 'express';
import { commandHandler, CommandHandler, DB, queryHandler } from '../../api-infrastructure';
import { failure, Failure, isFailure, Result, unwrap } from '../../util/result-monad';
import { keys, omit } from '../../util/util';
import * as DEFAULT_TEMPLATES from './default-templates';
import {
  CreateResponseGeneratorTemplateCommand,
  DeleteResponseGeneratorTemplateCommand,
  ResponseGeneratorTemplateDto,
  ResponseGeneratorTemplateEntity,
  ResponseGeneratorTemplateEntityDefinition,
  UpdateResponseGeneratorTemplateCommand,
} from './response-generator-template.types';

export const RESPONSE_GENERATOR_TEMPLATE_ENTITY_DEFINITION: ResponseGeneratorTemplateEntityDefinition = {
  entityType: 'response-generator-template',
  '@': 'VersionedRootEntityDefinition',
};

export async function getAllAsync() {
  const allTemplates = await DB.query(RESPONSE_GENERATOR_TEMPLATE_ENTITY_DEFINITION).allAsync();

  return allTemplates.map<ResponseGeneratorTemplateDto>(t => ({
    id: t.id,
    version: t.$metadata.version,
    name: t.name,
    description: t.description,
    generatorFunctionBody: t.generatorFunctionBody,
    parameters: t.parameters,
  }));
}

export async function getByIdsAndVersionsAsync(idsAndVersions: { [templateId: string]: number[] }) {
  const results = await Promise.all(
    keys(idsAndVersions)
      .reduce((agg, id) => [
        ...agg,
        ...idsAndVersions[id].map(v => DB.query(RESPONSE_GENERATOR_TEMPLATE_ENTITY_DEFINITION).byIdAndVersionAsync(id, v)),
      ], [] as Promise<Result<ResponseGeneratorTemplateEntity, string[]>>[])
  );

  const messages = results
    .filter(isFailure).map(r => r as any as Failure<string>)
    .reduce((agg, f) => [...agg, ...f.failure], [] as string[]);

  if (messages.length > 0) {
    return failure(messages);
  }

  const templates = results.map(unwrap);

  return templates.map<ResponseGeneratorTemplateDto>(t => ({
    id: t.id,
    version: t.$metadata.version,
    name: t.name,
    description: t.description,
    generatorFunctionBody: t.generatorFunctionBody,
    parameters: t.parameters,
  }));
}

type ResponseGeneratorTemplateCommandHandler<TCommand> = CommandHandler<TCommand, {
  templateId: string;
  templateVersion: number;
}>;

export const createAsync: ResponseGeneratorTemplateCommandHandler<CreateResponseGeneratorTemplateCommand> = async command => {
  const template = await DB.createAsync(RESPONSE_GENERATOR_TEMPLATE_ENTITY_DEFINITION, command);

  return {
    templateId: template.id,
    templateVersion: template.$metadata.version,
  };
};

// TODO: validate
createAsync.constraints = {
  name: {},
  description: {},
  generatorFunctionBody: {},
  parameters: {},
};

export const updateAsync: ResponseGeneratorTemplateCommandHandler<UpdateResponseGeneratorTemplateCommand> = async command => {
  const result = await DB.patchAsync(
    RESPONSE_GENERATOR_TEMPLATE_ENTITY_DEFINITION,
    command.templateId,
    command.unmodifiedTemplateVersion,
    omit(command, 'templateId', 'unmodifiedTemplateVersion'),
  );

  if (isFailure(result)) {
    return result;
  }

  return {
    templateId: command.templateId,
    templateVersion: result.success,
  };
};

// TODO: validate
updateAsync.constraints = {
  templateId: {},
  unmodifiedTemplateVersion: {},
  name: {},
  description: {},
  generatorFunctionBody: {},
  parameters: {},
};

export const deleteAsync: CommandHandler<DeleteResponseGeneratorTemplateCommand> = async command => {
  return await DB.deleteAsync(RESPONSE_GENERATOR_TEMPLATE_ENTITY_DEFINITION, command.templateId, command.unmodifiedTemplateVersion);
};

// TODO: validate
deleteAsync.constraints = {
  templateId: {},
  unmodifiedTemplateVersion: {},
};

export const dropAllAsync: CommandHandler = async () => {
  await DB.dropAllAsync(RESPONSE_GENERATOR_TEMPLATE_ENTITY_DEFINITION.entityType);
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
api.post('/createDefaultTemplates', commandHandler(createDefaultTemplatesAsync));
