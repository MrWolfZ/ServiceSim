import { Action } from '@ngrx/store';

import { PredicateTemplateTileDto } from './predicate-template-tile.dto';

export class InitializePredicateTemplateTileAction implements Action {
  static readonly TYPE = 'configuration/predicate-templates-page/predicate-template-tile/INITIALIZE';
  readonly type = InitializePredicateTemplateTileAction.TYPE;

  constructor(
    public dto: PredicateTemplateTileDto,
  ) { }
}

export class DeletePredicateTemplateAction implements Action {
  static readonly TYPE = 'configuration/predicate-templates-page/predicate-template-tile/DELETE';
  readonly type = DeletePredicateTemplateAction.TYPE;

  constructor(
    public templateId: string,
  ) { }
}

export type PredicateTemplateTileActions =
  | InitializePredicateTemplateTileAction
  | DeletePredicateTemplateAction
  ;
