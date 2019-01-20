import express from 'express';
import { Subscription } from 'rxjs';
import { commandHandler, queryHandler } from '../../api-infrastructure';
import { addChildPredicateNode, addChildPredicateNodeConstraints } from './commands/add-child-predicate-node';
import { deletePredicateNode, deletePredicateNodeConstraints } from './commands/delete-predicate-node';
import { setPredicateNodeResponseGenerator, setPredicateNodeResponseGeneratorConstraints } from './commands/set-predicate-node-response-generator';
import { updatePredicateNode, updatePredicateNodeConstraints } from './commands/update-predicate-node';
import { getAllPredicateNodes, getAllPredicateNodes2 } from './queries/get-all-predicate-nodes';

export async function initializePredicateNodesApi() {
  const subscriptions = [
    await getAllPredicateNodes.initialize(),
  ];

  return new Subscription(() => subscriptions.forEach(sub => sub.unsubscribe()));
}

export const predicateNodeApi = express.Router()
  .get('/', queryHandler(getAllPredicateNodes))
  .get('/getAll', queryHandler(getAllPredicateNodes2))
  .post('/addChildNode', commandHandler(addChildPredicateNode, addChildPredicateNodeConstraints))
  .post('/update', commandHandler(updatePredicateNode, updatePredicateNodeConstraints))
  .post('/setResponseGenerator', commandHandler(setPredicateNodeResponseGenerator, setPredicateNodeResponseGeneratorConstraints))
  .post('/delete', commandHandler(deletePredicateNode, deletePredicateNodeConstraints));
