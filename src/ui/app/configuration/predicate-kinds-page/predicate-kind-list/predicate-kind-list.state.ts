import { PredicateKindListItemDto, PredicateKindListItemState } from './predicate-kind-list-item';

export interface PredicateKindListDto {
  items: PredicateKindListItemDto[];
}

export interface PredicateKindListState extends PredicateKindListDto {
  items: PredicateKindListItemState[];
}

export const INITIAL_PREDICATE_KIND_LIST_STATE: PredicateKindListState = {
  items: undefined!,
};
