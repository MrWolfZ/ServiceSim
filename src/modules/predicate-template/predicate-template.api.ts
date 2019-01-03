import express from 'express';
import { DeleteByQueryOperation, IndexQuery } from 'ravendb';
import { commandHandler, CommandHandler, db, queryHandler } from '../../api-infrastructure';
import { failure, success } from '../../util/result-monad';
import { copyProps } from '../../util/util';
import {
  CreatePredicateTemplateCommand,
  DeletePredicateTemplateCommand,
  PredicateTemplateDto,
  PredicateTemplateEntity,
  UpdatePredicateTemplateCommand,
} from './predicate-template.types';

const COLLECTION_NAME = 'predicate-templates';

export async function getAllAsync() {
  const allTemplates = await db.withSession(s =>
    s.query<PredicateTemplateEntity>({ collection: COLLECTION_NAME }).waitForNonStaleResults().all()
  );

  return allTemplates.map<PredicateTemplateDto>(t => ({
    id: t.id,
    name: t.name,
    description: t.description,
    evalFunctionBody: t.evalFunctionBody,
    parameters: t.parameters,
    version: 1,
  }));
}

export const createAsync: CommandHandler<CreatePredicateTemplateCommand, { templateId: string }> = async command => {
  const template: PredicateTemplateEntity = {
    id: undefined!,
    $collection: COLLECTION_NAME,
    ...command,
  };

  await db.withSession(async s => {
    await s.store(template);

    await s.saveChanges();
  });

  return {
    templateId: template.id,
  };
};

// TODO: validate
createAsync.constraints = {
  name: {},
  description: {},
  evalFunctionBody: {},
  parameters: {},
};

export const updateAsync: CommandHandler<UpdatePredicateTemplateCommand> = async command => {
  // TODO: validate (including exists and version)
  if (1 !== 1) {
    return failure([]);
  }

  await db.withSession(async s => {
    const template = await s.load<PredicateTemplateEntity>(command.templateId);
    copyProps(template, command);
    await s.saveChanges();
  });

  return success();
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
  // TODO: validate exists
  // TODO: only allow if template is unused
  if (1 !== 1) {
    return failure([]);
  }

  await db.withSession(async s => {
    await s.delete(command.templateId);
    await s.saveChanges();
  });

  return success();
};

// TODO: validate
deleteAsync.constraints = {
  templateId: {},
  unmodifiedTemplateVersion: {},
};

export const deleteAllAsync: CommandHandler<void> = async () => {
  await db.withSession(async s => {
    await s.advanced.documentStore.operations.send(new DeleteByQueryOperation(new IndexQuery('from \'predicate-templates\'')));
    await s.saveChanges();
  });
};

export const api = express.Router();
api.get('/', queryHandler(getAllAsync));
api.post('/create', commandHandler(createAsync));
api.post('/update', commandHandler(updateAsync));
api.post('/delete', commandHandler(deleteAsync));
