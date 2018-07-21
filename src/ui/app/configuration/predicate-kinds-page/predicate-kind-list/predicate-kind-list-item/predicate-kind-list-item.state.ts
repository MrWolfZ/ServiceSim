import { PredicateKindListItemDto } from './predicate-kind-list-item.dto';

export interface PredicateKindListItemState extends PredicateKindListItemDto {

}

export const INITIAL_PREDICATE_KIND_LIST_ITEM_STATE: PredicateKindListItemState = {
  name: '',
  description: '',
  evalFunctionBody: '',
};
