import express from 'express';
import { EventLog, requestHandler } from '../../api-infrastructure';
import { assertNever } from '../../util/assert';
import { ChildPredicateNodeAdded, PredicateNodeCreated, ResponseGeneratorSet } from './predicate-node.events';
import { PredicateNodeDto } from './predicate-node.types';

const SUBSCRIBED_EVENT_KINDS: SubscribedEvents['kind'][] = [
  PredicateNodeCreated.KIND,
  ChildPredicateNodeAdded.KIND,
  ResponseGeneratorSet.KIND,
];

type SubscribedEvents =
  | PredicateNodeCreated
  | ChildPredicateNodeAdded
  | ResponseGeneratorSet
  ;

const getAllResponse: PredicateNodeDto[] = [];

export function start() {
  return EventLog.getStream<SubscribedEvents>(SUBSCRIBED_EVENT_KINDS).subscribe(ev => {
    switch (ev.kind) {
      case PredicateNodeCreated.KIND: {
        const dto: PredicateNodeDto = {
          id: ev.nodeId,
          version: 1,
          ...ev.data,
        };

        getAllResponse.push(dto);
        return;
      }

      case ChildPredicateNodeAdded.KIND: {
        return;
      }

      case ResponseGeneratorSet.KIND: {
        return;
      }

      default:
        return assertNever(ev);
    }
  });
}

export function getAllAsync() {
  return getAllResponse;
}

export const api = express.Router();
api.get('/', requestHandler(getAllAsync));
