import { PredicateKindListItemState } from './predicate-kind-list-item';
import { PredicateKindListDto } from './predicate-kind-list.dto';

export interface PredicateKindListState extends PredicateKindListDto {
  items: PredicateKindListItemState[];
}

export const INITIAL_PREDICATE_KIND_LIST_STATE: PredicateKindListState = {
  items: undefined!,
};
