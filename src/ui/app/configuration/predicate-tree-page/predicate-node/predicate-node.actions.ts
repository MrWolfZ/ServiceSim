import { Action } from '@ngrx/store';

import { PredicateNodeDto } from './predicate-node.dto';

export class InitializePredicateNodeAction implements Action {
  static readonly TYPE = 'configuration/predicate-tree-page/predicate-node/INITIALIZE';
  readonly type = InitializePredicateNodeAction.TYPE;

  constructor(
    public dto: PredicateNodeDto,
  ) { }
}

export class TogglePredicateNodeExpansionAction implements Action {
  static readonly TYPE = 'configuration/predicate-tree-page/predicate-node/TOGGLE_EXPANSION';
  readonly type = TogglePredicateNodeExpansionAction.TYPE;

  constructor(
    public nodeId: string,
  ) { }
}

export class SelectPredicateNodeAction implements Action {
  static readonly TYPE = 'configuration/predicate-tree-page/predicate-node/SELECT';
  readonly type = SelectPredicateNodeAction.TYPE;

  constructor(
    public nodeId: string,
  ) { }
}

export type PredicateNodeActions =
  | InitializePredicateNodeAction
  | TogglePredicateNodeExpansionAction
  | SelectPredicateNodeAction
  ;
