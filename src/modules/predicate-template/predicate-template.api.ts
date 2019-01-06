import express from 'express';
import { commandHandler, CommandHandler, DB, queryHandler } from '../../api-infrastructure';
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
  const allTemplates = await DB.query(PREDICATE_TEMPLATE_ENTITY_DEFINITION).allAsync();

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
        ...idsAndVersions[id].map(v => DB.query(PREDICATE_TEMPLATE_ENTITY_DEFINITION).byIdAndVersionAsync(id, v)),
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

type PredicateTemplateCommandHandler<TCommand> = CommandHandler<TCommand, {
  templateId: string;
  templateVersion: number;
}>;

export const createPredicateTemplate: PredicateTemplateCommandHandler<CreatePredicateTemplateCommand> = async command => {
  const template = await DB.createAsync(PREDICATE_TEMPLATE_ENTITY_DEFINITION, command);

  return {
    templateId: template.id,
    templateVersion: template.$metadata.version,
  };
};

// TODO: validate
createPredicateTemplate.constraints = {
  name: {},
  description: {},
  evalFunctionBody: {},
  parameters: {},
};

export const updatePredicateTemplate: PredicateTemplateCommandHandler<UpdatePredicateTemplateCommand> = async command => {
  const newVersion = await DB.patchAsync(
    PREDICATE_TEMPLATE_ENTITY_DEFINITION,
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
updatePredicateTemplate.constraints = {
  templateId: {},
  unmodifiedTemplateVersion: {},
  name: {},
  description: {},
  evalFunctionBody: {},
  parameters: {},
};

export const deletePredicateTemplate: CommandHandler<DeletePredicateTemplateCommand> = async command => {
  return await DB.deleteAsync(PREDICATE_TEMPLATE_ENTITY_DEFINITION, command.templateId, command.unmodifiedTemplateVersion);
};

// TODO: validate
deletePredicateTemplate.constraints = {
  templateId: {},
  unmodifiedTemplateVersion: {},
};

export const dropAllPredicateTemplates: CommandHandler = async () => {
  await DB.dropAllAsync(PREDICATE_TEMPLATE_ENTITY_DEFINITION.entityType);
};

export const createDefaultPredicateTemplatesAsync: CommandHandler = async () => {
  for (const key of keys(DEFAULT_TEMPLATES)) {
    await createPredicateTemplate(DEFAULT_TEMPLATES[key]);
  }
};

export const predicateTemplatesApi = express.Router()
  .get('/', queryHandler(getAllPredicateTemplates))
  .post('/create', commandHandler(createPredicateTemplate))
  .post('/update', commandHandler(updatePredicateTemplate))
  .post('/delete', commandHandler(deletePredicateTemplate))
  .post('/createDefaultTemplates', commandHandler(createDefaultPredicateTemplatesAsync));
