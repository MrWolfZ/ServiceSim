import express from 'express';
import { commandHandler, queryHandler } from '../../../api-infrastructure';
import { addChildPredicateNodeFromTemplate, addChildPredicateNodeFromTemplateConstraints } from './commands/add-child-predicate-node-from-template';
import {
  addChildPredicateNodeWithCustomFunctionBody,
  addChildPredicateNodeWithCustomFunctionBodyConstraints,
} from './commands/add-child-predicate-node-with-custom-function-body';
import { deletePredicateNode, deletePredicateNodeConstraints } from './commands/delete-predicate-node';
import {
  setPredicateNodeResponseGeneratorFromTemplate,
  setPredicateNodeResponseGeneratorFromTemplateConstraints,
} from './commands/set-predicate-node-response-generator-from-template';
import {
  setPredicateNodeResponseGeneratorWithCustomBody,
  setPredicateNodeResponseGeneratorWithCustomBodyConstraints,
} from './commands/set-predicate-node-response-generator-with-custom-body';
import { updatePredicateNode, updatePredicateNodeConstraints } from './commands/update-predicate-node';
import { getAllPredicateNodes } from './queries/get-all-predicate-nodes';

// tslint:disable:max-line-length
export const predicateNodeApi = express.Router()
  .get('/', queryHandler(getAllPredicateNodes))
  .post('/addChildNodeWithCustomFunctionBody', commandHandler(addChildPredicateNodeWithCustomFunctionBody, addChildPredicateNodeWithCustomFunctionBodyConstraints))
  .post('/addChildNodeFromTemplate', commandHandler(addChildPredicateNodeFromTemplate, addChildPredicateNodeFromTemplateConstraints))
  .post('/update', commandHandler(updatePredicateNode, updatePredicateNodeConstraints))
  .post('/setResponseGeneratorWithCustomBody', commandHandler(setPredicateNodeResponseGeneratorWithCustomBody, setPredicateNodeResponseGeneratorWithCustomBodyConstraints))
  .post('/setResponseGeneratorFromTemplate', commandHandler(setPredicateNodeResponseGeneratorFromTemplate, setPredicateNodeResponseGeneratorFromTemplateConstraints))
  .post('/delete', commandHandler(deletePredicateNode, deletePredicateNodeConstraints));