import express, { Request, Response } from 'express';

import { Ask, Tell } from './infrastructure/infrastructure.dto';

import { PredicateKindsApi } from './configuration/predicate-kinds-page/predicate-kinds.api';
import {
  ASK_FOR_PREDICATE_KINDS_PAGE_DTO_KIND,
  AskForPredicateKindsPageDto,
  CREATE_NEW_PREDICATE_KIND_COMMAND_KIND,
  CreateNewPredicateKindCommand,
  DELETE_PREDICATE_KIND_COMMAND_KIND,
  DeletePredicateKindCommand,
  UPDATE_PREDICATE_KIND_COMMAND_KIND,
  UpdatePredicateKindCommand,
} from './configuration/predicate-kinds-page/predicate-kinds.dto';

export const askAsync = async (req: Request, res: Response) => {
  const ask = req.body as Ask<string, any>;

  switch (ask.kind) {
    case ASK_FOR_PREDICATE_KINDS_PAGE_DTO_KIND:
      const response = await PredicateKindsApi.askForPageDto(ask as AskForPredicateKindsPageDto);
      res.status(200).send(response);
      break;

    default:
      res.status(404).send();
      break;
  }
};

export const tellAsync = async (req: Request, res: Response) => {
  const tell = req.body as Tell<string, any>;

  switch (tell.kind) {
    case CREATE_NEW_PREDICATE_KIND_COMMAND_KIND: {
      const response = await PredicateKindsApi.createNewPredicateKind(tell as CreateNewPredicateKindCommand);
      res.status(200).send(response);
      break;
    }

    case UPDATE_PREDICATE_KIND_COMMAND_KIND: {
      await PredicateKindsApi.updatePredicateKind(tell as UpdatePredicateKindCommand);
      res.status(204).send();
      break;
    }

    case DELETE_PREDICATE_KIND_COMMAND_KIND: {
      await PredicateKindsApi.deletePredicateKind(tell as DeletePredicateKindCommand);
      res.status(204).send();
      break;
    }

    default:
      res.status(404).send();
      break;
  }
};

const api = express.Router();
api.post('/ask', askAsync);
api.post('/tell', tellAsync);

export default api;
