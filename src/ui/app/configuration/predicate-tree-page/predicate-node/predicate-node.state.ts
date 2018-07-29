import { ParameterDto, PredicateNodeDto } from './predicate-node.dto';

export interface PredicateParameterState extends ParameterDto {
}

export interface PredicateNodeState extends PredicateNodeDto {
  parameters: PredicateParameterState[];
  isExpanded: boolean;
  childNodes: PredicateNodeState[];
}

export const INITIAL_PREDICATE_NODE_STATE: PredicateNodeState = {
  nodeId: '',
  predicateKindName: '',
  parameters: [],
  isExpanded: false,
  childNodes: [],
  responseGenerator: undefined,
};
