import express from 'express';
import { commandHandler, CommandValidationConstraints, DB, queryHandler } from '../../api-infrastructure';
import { keys, omit } from '../../util/util';
import * as DEFAULT_TEMPLATES from './default-templates';
import {
  CreatePredicateTemplateCommand,
  DeletePredicateTemplateCommand,
  PredicateTemplateAggregate,
  PredicateTemplateAggregateType,
  PredicateTemplateDto,
  UpdatePredicateTemplateCommand,
} from './predicate-template.types';

const repo = DB.versionedRepository<PredicateTemplateAggregateType, PredicateTemplateAggregate>('predicate-template');

export async function getAllPredicateTemplates() {
  const allTemplates = await repo.query.all();

  allTemplates[0].$metadata.changesSinceLastVersion;

  return allTemplates.map<PredicateTemplateDto>(t => ({
    id: t.id,
    version: t.$metadata.version,
    name: t.name,
    description: t.description,
    evalFunctionBody: t.evalFunctionBody,
    parameters: t.parameters,
  }));
}

export async function getPredicateTemplatesByIdsAndVersions(idsAndVersions: { [templateId: string]: number[] }) {
  const templates = await Promise.all(
    keys(idsAndVersions).flatMap(id => idsAndVersions[id].map(v => repo.query.byIdAndVersion(id, v)))
  );

  return templates.map<PredicateTemplateDto>(t => ({
    id: t.id,
    version: t.$metadata.version,
    name: t.name,
    description: t.description,
    evalFunctionBody: t.evalFunctionBody,
    parameters: t.parameters,
  }));
}

export async function createPredicateTemplate(command: CreatePredicateTemplateCommand) {
  const template = await repo.create(command);

  return {
    templateId: template.id,
    templateVersion: 1,
  };
}

// TODO: validate
export const createPredicateTemplateConstraints: CommandValidationConstraints<CreatePredicateTemplateCommand> = {
  name: {},
  description: {},
  evalFunctionBody: {},
  parameters: {},
};

export async function updatePredicateTemplate(command: UpdatePredicateTemplateCommand) {
  const newVersion = await repo.patch(
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
export const updatePredicateTemplateConstraints: CommandValidationConstraints<UpdatePredicateTemplateCommand> = {
  templateId: {},
  unmodifiedTemplateVersion: {},
  name: {},
  description: {},
  evalFunctionBody: {},
  parameters: {},
};

export async function deletePredicateTemplate(command: DeletePredicateTemplateCommand) {
  return await repo.delete(command.templateId, command.unmodifiedTemplateVersion);
}

// TODO: validate
export const deletePredicateTemplateConstraints: CommandValidationConstraints<DeletePredicateTemplateCommand> = {
  templateId: {},
  unmodifiedTemplateVersion: {},
};

export async function dropAllPredicateTemplates() {
  await repo.dropAll();
}

export async function createDefaultPredicateTemplates() {
  for (const key of keys(DEFAULT_TEMPLATES)) {
    await createPredicateTemplate(DEFAULT_TEMPLATES[key]);
  }
}

export const predicateTemplatesApi = express.Router()
  .get('/', queryHandler(getAllPredicateTemplates))
  .post('/create', commandHandler(createPredicateTemplate, createPredicateTemplateConstraints))
  .post('/update', commandHandler(updatePredicateTemplate, updatePredicateTemplateConstraints))
  .post('/delete', commandHandler(deletePredicateTemplate, deletePredicateTemplateConstraints))
  .post('/createDefaultTemplates', commandHandler(createDefaultPredicateTemplates));
