export interface PredicateKindListItemDto {
  name: string;
  description: string;
  evalFunctionBody: string;
}

export interface PredicateKindListItemState extends PredicateKindListItemDto {

}

export const INITIAL_PREDICATE_KIND_LIST_ITEM_STATE: PredicateKindListItemState = {
  name: '',
  description: '',
  evalFunctionBody: '',
};
