import { Request, Response } from 'express';

export let getApi = (_: Request, res: Response) => {
  res.send({});
};
