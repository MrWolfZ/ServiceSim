import { ParameterDto, PredicateNodeDto } from './predicate-node.dto';

export interface PredicateParameterState extends ParameterDto {
}

export interface PredicateNodeState extends PredicateNodeDto {
  parameters: PredicateParameterState[];
  isExpanded: boolean;
  isSelected: boolean;
  childNodes: PredicateNodeState[];
}

export const INITIAL_PREDICATE_NODE_STATE: PredicateNodeState = {
  nodeId: '',
  predicateKindName: '',
  parameters: [],
  isExpanded: true, // TODO: set to false once devlopment finishes
  isSelected: false,
  childNodes: [],
  responseGenerator: undefined,
};
