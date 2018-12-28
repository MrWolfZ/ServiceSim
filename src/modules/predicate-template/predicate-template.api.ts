import express, { Request, Response } from 'express';
import { EventLog } from '../../api-infrastructure';
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

export function getAllAsync(_: Request, res: Response) {
  res.status(200).send(getAllResponse);
}

// export async function createOrUpdatePredicateTemplate(tell: Tell): Promise<Result<TellToCreateOrUpdatePredicateTemplate['dto']>> {
//   const isValid = validatePredicateTemplateDialog(createFormGroupState('', tell.formValue)).isValid;

//   if (!isValid) {
//     return failure();
//   }

//   const template = await (async () => {
//     if (!!tell.templateId) {
//       return (await PredicateTemplate.ofIdAsync(tell.templateId!)).update(
//         tell.formValue.name,
//         tell.formValue.description,
//         tell.formValue.evalFunctionBody,
//         tell.formValue.parameters,
//       );
//     }

//     return PredicateTemplate.create(
//       tell.formValue.name,
//       tell.formValue.description,
//       tell.formValue.evalFunctionBody,
//       tell.formValue.parameters,
//     );
//   })();

//   await PredicateTemplate.saveAsync(template);

//   return success({
//     templateId: template.id,
//   });
// }

// // TODO: validate predicate kind exists
// // TODO: only allow if predicate kind is unused
// export async function deletePredicateTemplate(tell: DeletePredicateTemplateCommand) {
//   const predicateKind = await PredicateTemplate.ofIdAsync(tell.templateId);
//   predicateKind.delete();

//   await PredicateTemplate.saveAsync(predicateKind);

//   return success();
// }

const askApi = express.Router();
askApi.get('/all', getAllAsync);

export const api = express.Router();
api.use('/ask', askApi);
