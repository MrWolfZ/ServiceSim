import express, { Request, Response } from 'express';

import { isSuccess } from '../../infrastructure';
import { Ask, Tell } from './infrastructure/infrastructure.dto';

import { PredicateTemplatesApi } from './configuration/predicate-templates-page/predicate-templates.api';

export const askAsync = async (req: Request, res: Response) => {
  const ask = req.body as Ask<string, any>;

  const apis = [
    PredicateTemplatesApi.matchAsk,
  ];

  for (const api of apis) {
    const result = await api(ask);

    if (isSuccess(result)) {
      const response = result.success;
      if (!!response) {
        res.status(200).send(response);
      } else {
        res.status(204).send();
      }

      return;
    }
  }

  res.status(404).send();
};

export const tellAsync = async (req: Request, res: Response) => {
  const tell = req.body as Tell<string, any>;

  const apis = [
    PredicateTemplatesApi.matchTell,
  ];

  for (const api of apis) {
    const result = await api(tell);

    if (isSuccess(result)) {
      if (isSuccess(result.success)) {
        const response = result.success.success;
        if (!!response) {
          res.status(200).send(response);
        } else {
          res.status(204).send();
        }
      } else {
        res.status(400).send();
      }

      return;
    }
  }

  res.status(404).send();
};

const api = express.Router();
api.post('/ask', askAsync);
api.post('/tell', tellAsync);

export default api;
