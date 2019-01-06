import express from 'express';
import { commandHandler, CommandValidationConstraints, DB, queryHandler } from '../../api-infrastructure';
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
  const allTemplates = await DB.query(RESPONSE_GENERATOR_TEMPLATE_ENTITY_DEFINITION).all();

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
        ...idsAndVersions[id].map(v => DB.query(RESPONSE_GENERATOR_TEMPLATE_ENTITY_DEFINITION).byIdAndVersion(id, v)),
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

export async function createResponseGeneratorTemplate(command: CreateResponseGeneratorTemplateCommand) {
  const template = await DB.create(RESPONSE_GENERATOR_TEMPLATE_ENTITY_DEFINITION, command);

  return {
    templateId: template.id,
    templateVersion: template.$metadata.version,
  };
}

// TODO: validate
export const createResponseGeneratorTemplateConstraints: CommandValidationConstraints<CreateResponseGeneratorTemplateCommand> = {
  name: {},
  description: {},
  generatorFunctionBody: {},
  parameters: {},
};

export async function updateResponseGeneratorTemplate(command: UpdateResponseGeneratorTemplateCommand) {
  const newVersion = await DB.patch(
    RESPONSE_GENERATOR_TEMPLATE_ENTITY_DEFINITION,
    command.templateId,
    command.unmodifiedTemplateVersion,
    omit(command, 'templateId', 'unmodifiedTemplateVersion'),
  );

  return {
    templateId: command.templateId,
    templateVersion: newVersion,
  };
}

// TODO: validate
export const updateResponseGeneratorTemplateConstraints: CommandValidationConstraints<UpdateResponseGeneratorTemplateCommand> = {
  templateId: {},
  unmodifiedTemplateVersion: {},
  name: {},
  description: {},
  generatorFunctionBody: {},
  parameters: {},
};

export async function deleteResponseGeneratorTemplate(command: DeleteResponseGeneratorTemplateCommand) {
  return await DB.delete(RESPONSE_GENERATOR_TEMPLATE_ENTITY_DEFINITION, command.templateId, command.unmodifiedTemplateVersion);
}

// TODO: validate
export const deleteResponseGeneratorTemplateConstraints: CommandValidationConstraints<DeleteResponseGeneratorTemplateCommand> = {
  templateId: {},
  unmodifiedTemplateVersion: {},
};

export async function dropAllResponseGeneratorTemplates() {
  await DB.dropAll(RESPONSE_GENERATOR_TEMPLATE_ENTITY_DEFINITION.entityType);
}

export async function createDefaultResponseGeneratorTemplates() {
  for (const key of keys(DEFAULT_TEMPLATES)) {
    await createResponseGeneratorTemplate(DEFAULT_TEMPLATES[key]);
  }
}

export const responseGeneratorTemplateApi = express.Router()
  .get('/', queryHandler(getAllResponseGeneratorTemplates))
  .post('/create', commandHandler(createResponseGeneratorTemplate, createResponseGeneratorTemplateConstraints))
  .post('/update', commandHandler(updateResponseGeneratorTemplate, updateResponseGeneratorTemplateConstraints))
  .post('/delete', commandHandler(deleteResponseGeneratorTemplate, deleteResponseGeneratorTemplateConstraints))
  .post('/createDefaultTemplates', commandHandler(createDefaultResponseGeneratorTemplates));
