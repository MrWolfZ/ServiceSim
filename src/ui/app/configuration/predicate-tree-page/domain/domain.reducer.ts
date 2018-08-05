import { Action } from '@ngrx/store';

import { callNestedReducers, createArrayReducer } from 'app/infrastructure';

import { DomainState, INITIAL_DOMAIN_STATE } from './domain.state';
import { predicateNodeReducer } from './predicate-node';

export function domainReducer(state = INITIAL_DOMAIN_STATE, action: Action): DomainState {
  state = callNestedReducers<DomainState>(state, action, {
    nodes: createArrayReducer(predicateNodeReducer),
  });

  return state;
}
