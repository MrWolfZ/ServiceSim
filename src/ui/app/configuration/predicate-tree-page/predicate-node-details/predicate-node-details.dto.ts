export interface ParameterDto {
  name: string;
  value: string | number | boolean;
}

export interface ChildNodeDto {
  nodeId: string;
  predicateKindName: string;
}

export interface ResponseGeneratorDto {
  responseGeneratorKindName: string;
  parameters: ParameterDto[];
}

export interface PredicateNodeDetailsDto {
  nodeId: string;
  predicateKindName: string;
  parameters: ParameterDto[];
  childNodes: ChildNodeDto[];
  responseGenerator: ResponseGeneratorDto | undefined;
}
