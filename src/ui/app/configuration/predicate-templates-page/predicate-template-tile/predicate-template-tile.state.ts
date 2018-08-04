import { PredicateTemplateTileDto } from './predicate-template-tile.dto';

export interface PredicateTemplateTileState extends PredicateTemplateTileDto {

}

export const INITIAL_PREDICATE_TEMPLATE_TILE_STATE: PredicateTemplateTileState = {
  templateId: '',
  name: '',
  description: '',
  evalFunctionBody: '',
  parameters: [],
};
