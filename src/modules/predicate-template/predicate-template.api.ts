import express from 'express';
import { commandHandler, CommandValidationConstraints, DB, queryHandler } from '../../api-infrastructure';
import { keys, omit } from '../../util/util';
import * as DEFAULT_TEMPLATES from './default-templates';
import {
  CreatePredicateTemplateCommand,
  DeletePredicateTemplateCommand,
  PredicateTemplateDto,
  PredicateTemplateEntity,
  PredicateTemplateEntityDefinition,
  UpdatePredicateTemplateCommand,
} from './predicate-template.types';

export const PREDICATE_TEMPLATE_ENTITY_DEFINITION: PredicateTemplateEntityDefinition = {
  entityType: 'predicate-template',
  '@': 'VersionedRootEntityDefinition',
};

export async function getAllPredicateTemplates() {
  const allTemplates = await DB.query(PREDICATE_TEMPLATE_ENTITY_DEFINITION).all();

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
    keys(idsAndVersions)
      .reduce((agg, id) => [
        ...agg,
        ...idsAndVersions[id].map(v => DB.query(PREDICATE_TEMPLATE_ENTITY_DEFINITION).byIdAndVersion(id, v)),
      ], [] as Promise<PredicateTemplateEntity>[])
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
  const template = await DB.create(PREDICATE_TEMPLATE_ENTITY_DEFINITION, command);

  return {
    templateId: template.id,
    templateVersion: template.$metadata.version,
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
  const newVersion = await DB.patch(
    PREDICATE_TEMPLATE_ENTITY_DEFINITION,
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
  return await DB.delete(PREDICATE_TEMPLATE_ENTITY_DEFINITION, command.templateId, command.unmodifiedTemplateVersion);
}

// TODO: validate
export const deletePredicateTemplateConstraints: CommandValidationConstraints<DeletePredicateTemplateCommand> = {
  templateId: {},
  unmodifiedTemplateVersion: {},
};

export async function dropAllPredicateTemplates() {
  await DB.dropAll(PREDICATE_TEMPLATE_ENTITY_DEFINITION.entityType);
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
