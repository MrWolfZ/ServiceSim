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

export async function getAllAsync() {
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

export async function getByIdsAndVersionsAsync(idsAndVersions: { [templateId: string]: number[] }) {
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

export const createAsync: PredicateTemplateCommandHandler<CreatePredicateTemplateCommand> = async command => {
  const template = await DB.createAsync(PREDICATE_TEMPLATE_ENTITY_DEFINITION, command);

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
updateAsync.constraints = {
  templateId: {},
  unmodifiedTemplateVersion: {},
  name: {},
  description: {},
  evalFunctionBody: {},
  parameters: {},
};

export const deleteAsync: CommandHandler<DeletePredicateTemplateCommand> = async command => {
  return await DB.deleteAsync(PREDICATE_TEMPLATE_ENTITY_DEFINITION, command.templateId, command.unmodifiedTemplateVersion);
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
  for (const key of keys(DEFAULT_TEMPLATES)) {
    await createAsync(DEFAULT_TEMPLATES[key]);
  }
};

export const api = express.Router();
api.get('/', queryHandler(getAllAsync));
api.post('/create', commandHandler(createAsync));
api.post('/update', commandHandler(updateAsync));
api.post('/delete', commandHandler(deleteAsync));
api.post('/createDefaultTemplates', commandHandler(createDefaultTemplatesAsync));
