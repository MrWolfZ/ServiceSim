import express, { Request, Response } from 'express';

import { Ask } from './infrastructure/infrastructure.dto';

import { askForPredicateKindsPageDto } from './configuration/predicate-kinds-page/predicate-kinds.api';
import { ASK_FOR_PREDICATE_KINDS_PAGE_DTO_KIND } from './configuration/predicate-kinds-page/predicate-kinds.dto';

export const askAsync = async (req: Request, res: Response) => {
  const ask = req.body as Ask<string, any>;

  switch (ask.kind) {
    case ASK_FOR_PREDICATE_KINDS_PAGE_DTO_KIND:
      const response = await askForPredicateKindsPageDto(ask as Ask<typeof ASK_FOR_PREDICATE_KINDS_PAGE_DTO_KIND, any>);
      res.status(200).send(response);
      break;

    default:
      res.status(404).send();
      break;
  }
};

const api = express.Router();
api.post('/ask', askAsync);

export default api;
