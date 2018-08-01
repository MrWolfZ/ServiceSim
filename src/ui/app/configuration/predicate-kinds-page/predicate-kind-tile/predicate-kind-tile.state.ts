import { PredicateKindTileDto } from './predicate-kind-tile.dto';

export interface PredicateKindTileState extends PredicateKindTileDto {

}

export const INITIAL_PREDICATE_KIND_TILE_STATE: PredicateKindTileState = {
  predicateKindId: '',
  name: '',
  description: '',
  evalFunctionBody: '',
  parameters: [],
};
