import express from 'express';
import { commandHandler, CommandHandler, DB, queryHandler } from '../../api-infrastructure';
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

export async function getAllResponseGeneratorTemplates() {
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

export async function getResponseGeneratorTemplatesByIdsAndVersions(idsAndVersions: { [templateId: string]: number[] }) {
  const templates = await Promise.all(
    keys(idsAndVersions)
      .reduce((agg, id) => [
        ...agg,
        ...idsAndVersions[id].map(v => DB.query(RESPONSE_GENERATOR_TEMPLATE_ENTITY_DEFINITION).byIdAndVersionAsync(id, v)),
      ], [] as Promise<ResponseGeneratorTemplateEntity>[])
  );

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

export const createResponseGeneratorTemplate: ResponseGeneratorTemplateCommandHandler<CreateResponseGeneratorTemplateCommand> = async command => {
  const template = await DB.createAsync(RESPONSE_GENERATOR_TEMPLATE_ENTITY_DEFINITION, command);

  return {
    templateId: template.id,
    templateVersion: template.$metadata.version,
  };
};

// TODO: validate
createResponseGeneratorTemplate.constraints = {
  name: {},
  description: {},
  generatorFunctionBody: {},
  parameters: {},
};

export const updateResponseGeneratorTemplate: ResponseGeneratorTemplateCommandHandler<UpdateResponseGeneratorTemplateCommand> = async command => {
  const newVersion = await DB.patchAsync(
    RESPONSE_GENERATOR_TEMPLATE_ENTITY_DEFINITION,
    command.templateId,
    command.unmodifiedTemplateVersion,
    omit(command, 'templateId', 'unmodifiedTemplateVersion'),
  );

  return {
    templateId: command.templateId,
    templateVersion: newVersion,
  };
};

// TODO: validate
updateResponseGeneratorTemplate.constraints = {
  templateId: {},
  unmodifiedTemplateVersion: {},
  name: {},
  description: {},
  generatorFunctionBody: {},
  parameters: {},
};

export const deleteResponseGeneratorTemplate: CommandHandler<DeleteResponseGeneratorTemplateCommand> = async command => {
  return await DB.deleteAsync(RESPONSE_GENERATOR_TEMPLATE_ENTITY_DEFINITION, command.templateId, command.unmodifiedTemplateVersion);
};

// TODO: validate
deleteResponseGeneratorTemplate.constraints = {
  templateId: {},
  unmodifiedTemplateVersion: {},
};

export const dropAllResponseGeneratorTemplates: CommandHandler = async () => {
  await DB.dropAllAsync(RESPONSE_GENERATOR_TEMPLATE_ENTITY_DEFINITION.entityType);
};

export const createDefaultResponseGeneratorTemplates: CommandHandler = async () => {
  for (const key of keys(DEFAULT_TEMPLATES)) {
    await createResponseGeneratorTemplate(DEFAULT_TEMPLATES[key]);
  }
};

export const api = express.Router();
api.get('/', queryHandler(getAllResponseGeneratorTemplates));
api.post('/create', commandHandler(createResponseGeneratorTemplate));
api.post('/update', commandHandler(updateResponseGeneratorTemplate));
api.post('/delete', commandHandler(deleteResponseGeneratorTemplate));
api.post('/createDefaultTemplates', commandHandler(createDefaultResponseGeneratorTemplates));
