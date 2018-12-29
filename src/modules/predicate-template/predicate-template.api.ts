import express from 'express';
import { EventLog, requestHandler } from '../../api-infrastructure';
import { failure, success } from '../../util/result-monad';
import { PredicateTemplate } from './predicate-template';
import { PredicateTemplateCreatedOrUpdated } from './predicate-template-created-or-updated';
import { PredicateTemplateDeleted } from './predicate-template-deleted';
import { PredicateTemplateDto } from './predicate-template.dto';

const SUBSCRIBED_EVENT_KINDS: SubscribedEvents['kind'][] = [
  PredicateTemplateCreatedOrUpdated.KIND,
  PredicateTemplateDeleted.KIND,
];

type SubscribedEvents =
  | PredicateTemplateCreatedOrUpdated
  | PredicateTemplateDeleted
  ;

let getAllResponse: PredicateTemplateDto[] = [];

export function start() {
  return EventLog.subscribeToStream<SubscribedEvents>(SUBSCRIBED_EVENT_KINDS, {
    [PredicateTemplateCreatedOrUpdated.KIND]: ev => {
      const item: PredicateTemplateDto = {
        id: ev.templateId,
        name: ev.name,
        description: ev.description,
        evalFunctionBody: ev.evalFunctionBody,
        parameters: ev.parameters,
      };

      getAllResponse = [
        ...getAllResponse.filter(i => i.id !== item.id),
        item,
      ].sort((l, r) => l.name.localeCompare(r.name));
    },
    [PredicateTemplateDeleted.KIND]: ev => {
      getAllResponse = getAllResponse.filter(i => i.id !== ev.templateId);
    },
  });
}

export function getAllAsync() {
  return getAllResponse;
}

export async function createAsync(dto: PredicateTemplateDto) {
  // TODO: validate
  if (1 !== 1) {
    return failure({});
  }

  const template = PredicateTemplate.create(
    dto.name,
    dto.description,
    dto.evalFunctionBody,
    dto.parameters,
    dto.id,
  );

  await PredicateTemplate.saveAsync(template);

  return success();
}

export async function updateAsync(dto: PredicateTemplateDto) {
  // TODO: validate (including exists)
  if (1 !== 1) {
    return failure({});
  }

  let template = await PredicateTemplate.ofIdAsync(dto.id);
  template = template.update(
    dto.name,
    dto.description,
    dto.evalFunctionBody,
    dto.parameters,
  );

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
api.post('/', requestHandler(createAsync));
api.put('/:templateId', requestHandler(updateAsync));
api.delete('/:templateId', requestHandler(deleteAsync));
