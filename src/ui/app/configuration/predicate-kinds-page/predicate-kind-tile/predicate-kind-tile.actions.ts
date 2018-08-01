import { Action } from '@ngrx/store';

import { PredicateKindTileDto } from './predicate-kind-tile.dto';

export class InitializePredicateKindTileAction implements Action {
  static readonly TYPE = 'configuration/predicate-kinds-page/predicate-kind-tile/INITIALIZE';
  readonly type = InitializePredicateKindTileAction.TYPE;

  constructor(
    public dto: PredicateKindTileDto,
  ) { }
}

export class DeletePredicateKindAction implements Action {
  static readonly TYPE = 'configuration/predicate-kinds-page/predicate-kind-tile/DELETE';
  readonly type = DeletePredicateKindAction.TYPE;

  constructor(
    public predicateKindId: string,
  ) { }
}

export type PredicateKindTileActions =
  | InitializePredicateKindTileAction
  | DeletePredicateKindAction
  ;
