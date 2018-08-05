import { PredicateNode } from './predicate-node';

export interface DomainState {
  nodes: PredicateNode[];
}

export const INITIAL_DOMAIN_STATE: DomainState = {
  nodes: [],
};
