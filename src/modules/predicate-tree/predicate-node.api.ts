import express from 'express';
import { commandHandler, queryHandler } from '../../api-infrastructure';
import { addChildPredicateNode, addChildPredicateNodeConstraints } from './commands/add-child-predicate-node';
import { deletePredicateNode, deletePredicateNodeConstraints } from './commands/delete-predicate-node';
import { setPredicateNodeResponseGenerator, setPredicateNodeResponseGeneratorConstraints } from './commands/set-predicate-node-response-generator';
import { updatePredicateNode, updatePredicateNodeConstraints } from './commands/update-predicate-node';
import { getAllPredicateNodes } from './queries/get-all-predicate-nodes';

export const predicateNodeApi = express.Router()
  .get('/', queryHandler(getAllPredicateNodes))
  .post('/addChildNode', commandHandler(addChildPredicateNode, addChildPredicateNodeConstraints))
  .post('/update', commandHandler(updatePredicateNode, updatePredicateNodeConstraints))
  .post('/setResponseGenerator', commandHandler(setPredicateNodeResponseGenerator, setPredicateNodeResponseGeneratorConstraints))
  .post('/delete', commandHandler(deletePredicateNode, deletePredicateNodeConstraints));
