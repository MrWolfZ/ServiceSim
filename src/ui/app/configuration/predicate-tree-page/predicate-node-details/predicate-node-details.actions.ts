import { Action } from '@ngrx/store';

import { DomainState } from 'app/configuration/predicate-tree-page/domain';

export class InitializePredicateNodeDetailsAction implements Action {
  static readonly TYPE = 'configuration/predicate-tree-page/predicate-node-details/INITIALIZE';
  readonly type = InitializePredicateNodeDetailsAction.TYPE;

  constructor(
    public domainState: DomainState,
    public nodeId: string,
  ) {}
}

export type PredicateNodeDetailsActions =
  | InitializePredicateNodeDetailsAction
  ;
