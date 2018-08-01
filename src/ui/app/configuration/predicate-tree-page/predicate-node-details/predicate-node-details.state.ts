import { PredicateNodeDetailsDto } from './predicate-node-details.dto';

export interface PredicateNodeDetailsState extends PredicateNodeDetailsDto {

}

export const INITIAL_PREDICATE_NODE_DETAILS_STATE: PredicateNodeDetailsState = {
  nodeId: '',
};
