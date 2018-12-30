import express from 'express';
import { EventLog, requestHandler } from '../../api-infrastructure';
import { failure, success } from '../../util/result-monad';
import { PredicateTemplate } from './predicate-template.entity';
import { PredicateTemplateCreated, PredicateTemplateDeleted, PredicateTemplateUpdated } from './predicate-template.events';
import { CreatePredicateTemplateCommand, PredicateTemplateDto, UpdatePredicateTemplateCommand } from './predicate-template.types';

const SUBSCRIBED_EVENT_KINDS: SubscribedEvents['kind'][] = [
  PredicateTemplateCreated.KIND,
  PredicateTemplateUpdated.KIND,
  PredicateTemplateDeleted.KIND,
];

type SubscribedEvents =
  | PredicateTemplateCreated
  | PredicateTemplateUpdated
  | PredicateTemplateDeleted
  ;

const getAllResponse: PredicateTemplateDto[] = [];

export function start() {
  return EventLog.subscribeToStream<SubscribedEvents>(SUBSCRIBED_EVENT_KINDS, {
    [PredicateTemplateCreated.KIND]: ev => {
      getAllResponse.push({
        id: ev.templateId,
        version: 1,
        ...ev.data,
      });
    },
    [PredicateTemplateUpdated.KIND]: ev => {
      const item = getAllResponse.find(dto => dto.id === ev.templateId)!;
      Object.assign(item, ev.data);
      item.version += 1;
    },
    [PredicateTemplateDeleted.KIND]: ev => {
      getAllResponse.splice(getAllResponse.findIndex(dto => dto.id === ev.templateId), 1);
    },
  });
}

export function getAllAsync() {
  return getAllResponse;
}

export async function createAsync(command: CreatePredicateTemplateCommand) {
  // TODO: validate
  if (1 !== 1) {
    return failure({});
  }

  const template = PredicateTemplate.create(
    command.data,
    command.templateId,
  );

  await PredicateTemplate.saveAsync(template);

  return success();
}

export async function updateAsync(command: UpdatePredicateTemplateCommand) {
  // TODO: validate (including exists)
  if (1 !== 1) {
    return failure({});
  }

  let template = await PredicateTemplate.ofIdAsync(command.templateId);
  template = template.update(command.data);

  await PredicateTemplate.saveAsync(template);

  return success();
}

export async function deleteAsync(params: { templateId: string }) {
  // TODO: validate exists
  // TODO: only allow if template is unused
  if (1 !== 1) {
    return failure({});
  }

  let template = await PredicateTemplate.ofIdAsync(params.templateId);
  template = template.delete();

  await PredicateTemplate.saveAsync(template);

  return success();
}

export const api = express.Router();
api.get('/', requestHandler(getAllAsync));
api.post('/create', requestHandler(createAsync));
api.post('/update', requestHandler(updateAsync));
api.delete('/:templateId', requestHandler(deleteAsync));
