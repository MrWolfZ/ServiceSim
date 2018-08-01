import { Action } from '@ngrx/store';

import { PredicateNodeDetailsDto } from './predicate-node-details.dto';

export class InitializePredicateNodeDetailsAction implements Action {
  static readonly TYPE = 'configuration/predicate-tree-page/predicate-node-details/INITIALIZE';
  readonly type = InitializePredicateNodeDetailsAction.TYPE;

  constructor(
    public dto: PredicateNodeDetailsDto,
  ) {}
}

export type PredicateNodeDetailsActions =
  | InitializePredicateNodeDetailsAction
  ;
