import { Action } from '@ngrx/store';

import { DomainState, INITIAL_DOMAIN_STATE } from './domain.state';

export function domainReducer(state = INITIAL_DOMAIN_STATE, _: Action): DomainState {
  return state;
}
