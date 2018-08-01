import { Action } from '@ngrx/store';

import { PredicateKindsPageDto } from './predicate-kinds.dto';

export class LoadPredicateKindsPageDataAction implements Action {
  static readonly TYPE = 'configuration/predicate-kinds-page/LOAD_DATA';
  readonly type = LoadPredicateKindsPageDataAction.TYPE;
}

export class InitializePredicateKindsPageAction implements Action {
  static readonly TYPE = 'configuration/predicate-kinds-page/INITIALIZE';
  readonly type = InitializePredicateKindsPageAction.TYPE;

  constructor(
    public dto: PredicateKindsPageDto,
  ) {}
}

export class OpenNewPredicateKindDialogAction implements Action {
  static readonly TYPE = 'configuration/predicate-kinds-page/OPEN_NEW_PREDICATE_KIND_DIALOG';
  readonly type = OpenNewPredicateKindDialogAction.TYPE;
}

export type PredicateKindsPageActions =
  | LoadPredicateKindsPageDataAction
  | InitializePredicateKindsPageAction
  | OpenNewPredicateKindDialogAction
  ;
