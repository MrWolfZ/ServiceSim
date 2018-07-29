import { Action } from '@ngrx/store';

export class NavigateToPredicateTreeAction implements Action {
  static readonly TYPE = 'app/routing/NAVIGATE_TO_PREDICATE_TREE';
  readonly type = NavigateToPredicateTreeAction.TYPE;
}

export class NavigateToPredicateKindsAction implements Action {
  static readonly TYPE = 'app/routing/NAVIGATE_TO_PREDICATE_KINDS';
  readonly type = NavigateToPredicateKindsAction.TYPE;
}

export class NavigateToResponseGeneratorKindsAction implements Action {
  static readonly TYPE = 'app/routing/NAVIGATE_TO_RESPONSE_GENERATOR_KINDS';
  readonly type = NavigateToResponseGeneratorKindsAction.TYPE;
}

export type AppRoutingActions =
  | NavigateToPredicateTreeAction
  | NavigateToPredicateKindsAction
  | NavigateToResponseGeneratorKindsAction
  ;
