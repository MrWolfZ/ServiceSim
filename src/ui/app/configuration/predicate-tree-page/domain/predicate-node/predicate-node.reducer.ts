import { NULL_PREDICATE_NODE, PredicateNode, PredicateNodeActions } from './predicate-node';

export function predicateNodeReducer(node = NULL_PREDICATE_NODE, _: PredicateNodeActions): PredicateNode {
  return node;
}
