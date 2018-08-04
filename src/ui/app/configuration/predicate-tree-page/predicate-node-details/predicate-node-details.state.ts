import { ChildNodeDto, ParameterDto, PredicateNodeDetailsDto, ResponseGeneratorDto } from './predicate-node-details.dto';

export interface ParameterState extends ParameterDto {

}

export interface ChildNodeState extends ChildNodeDto {

}

export interface ResponseGeneratorState extends ResponseGeneratorDto {

}

export interface PredicateNodeDetailsState extends PredicateNodeDetailsDto {

}

export const INITIAL_PREDICATE_NODE_DETAILS_STATE: PredicateNodeDetailsState = {
  nodeId: '',
  predicateKindName: '',
  parameters: [],
  childNodes: [],
  responseGenerator: undefined,
};
