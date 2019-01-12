import express from 'express';
import { commandHandler, CommandValidationConstraints, DB, queryHandler } from '../../api-infrastructure';
import { keys } from '../../util';
import * as DEFAULT_TEMPLATES from './default-templates';
import {
  CreateResponseGeneratorTemplateCommand,
  DeleteResponseGeneratorTemplateCommand,
  ResponseGeneratorTemplateAggregate,
  ResponseGeneratorTemplateAggregateType,
  ResponseGeneratorTemplateDto,
  UpdateResponseGeneratorTemplateCommand,
} from './response-generator-template.types';

const repo = DB.versionedRepository<ResponseGeneratorTemplateAggregateType, ResponseGeneratorTemplateAggregate>('response-generator-template');

export async function getAllResponseGeneratorTemplates() {
  const allTemplates = await repo.query.all();

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
    keys(idsAndVersions).flatMap(id => idsAndVersions[id].map(v => repo.query.byIdAndVersion(id, v)))
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
  const template = await repo.create(command);

  return {
    templateId: template.id,
    templateVersion: 1,
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
  const newVersion = await repo.patch(
    command.templateId,
    command.unmodifiedTemplateVersion,
    command.diff,
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
  diff: {},
};

export async function deleteResponseGeneratorTemplate(command: DeleteResponseGeneratorTemplateCommand) {
  return await repo.delete(command.templateId, command.unmodifiedTemplateVersion);
}

// TODO: validate
export const deleteResponseGeneratorTemplateConstraints: CommandValidationConstraints<DeleteResponseGeneratorTemplateCommand> = {
  templateId: {},
  unmodifiedTemplateVersion: {},
};

export async function dropAllResponseGeneratorTemplates() {
  await repo.dropAll();
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
