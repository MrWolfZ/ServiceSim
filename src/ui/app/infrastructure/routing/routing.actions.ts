import { Action } from '@ngrx/store';

export class NavigateToPredicateTreeAction implements Action {
  static readonly TYPE = 'app/routing/NAVIGATE_TO_PREDICATE_TREE';
  readonly type = NavigateToPredicateTreeAction.TYPE;
}

export class NavigateToPredicateTemplatesAction implements Action {
  static readonly TYPE = 'app/routing/NAVIGATE_TO_PREDICATE_TEMPLATES';
  readonly type = NavigateToPredicateTemplatesAction.TYPE;
}

export class NavigateToResponseGeneratorTemplatesAction implements Action {
  static readonly TYPE = 'app/routing/NAVIGATE_TO_RESPONSE_GENERATOR_TEMPLATES';
  readonly type = NavigateToResponseGeneratorTemplatesAction.TYPE;
}

export type AppRoutingActions =
  | NavigateToPredicateTreeAction
  | NavigateToPredicateTemplatesAction
  | NavigateToResponseGeneratorTemplatesAction
  ;
