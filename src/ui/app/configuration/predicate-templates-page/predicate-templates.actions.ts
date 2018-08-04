import { Action } from '@ngrx/store';

import { PredicateTemplatesPageDto } from './predicate-templates.dto';

export class LoadPredicateTemplatesPageDataAction implements Action {
  static readonly TYPE = 'configuration/predicate-templates-page/LOAD_DATA';
  readonly type = LoadPredicateTemplatesPageDataAction.TYPE;
}

export class InitializePredicateTemplatesPageAction implements Action {
  static readonly TYPE = 'configuration/predicate-templates-page/INITIALIZE';
  readonly type = InitializePredicateTemplatesPageAction.TYPE;

  constructor(
    public dto: PredicateTemplatesPageDto,
  ) {}
}

export class OpenNewPredicateTemplateDialogAction implements Action {
  static readonly TYPE = 'configuration/predicate-templates-page/OPEN_NEW_PREDICATE_TEMPLATE_DIALOG';
  readonly type = OpenNewPredicateTemplateDialogAction.TYPE;
}

export type PredicateTemplatesPageActions =
  | LoadPredicateTemplatesPageDataAction
  | InitializePredicateTemplatesPageAction
  | OpenNewPredicateTemplateDialogAction
  ;
