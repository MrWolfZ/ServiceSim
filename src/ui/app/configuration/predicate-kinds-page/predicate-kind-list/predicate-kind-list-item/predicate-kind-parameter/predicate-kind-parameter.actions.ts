import { Action } from '@ngrx/store';

import { PredicateKindParameterDto } from './predicate-kind-parameter.dto';

export class InitializePredicateKindParameterAction implements Action {
  static readonly TYPE = 'configuration/predicate-kinds-page/predicate-kind-list/predicate-kind-list-item/predicate-kind-parameter/INITIALIZE';
  readonly type = InitializePredicateKindParameterAction.TYPE;

  constructor(
    public dto: PredicateKindParameterDto,
  ) {}
}

export class SetIsReadOnlyAction implements Action {
  static readonly TYPE = 'configuration/predicate-kinds-page/predicate-kind-list/predicate-kind-list-item/predicate-kind-parameter/SET_IS_READ_ONLY';
  readonly type = SetIsReadOnlyAction.TYPE;

  constructor(
    public isReadOnly: boolean,
  ) {}
}

export type PredicateKindParameterActions =
  | InitializePredicateKindParameterAction
  | SetIsReadOnlyAction
  ;
