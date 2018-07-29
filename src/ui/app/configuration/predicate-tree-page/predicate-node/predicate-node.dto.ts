export interface ParameterDto {
  name: string;
  value: string | number | boolean;
}

export interface ResponseGeneratorDto {
  responseGeneratorKindName: string;
  parameters: ParameterDto[];
}

export interface PredicateNodeDto {
  nodeId: string;
  predicateKindName: string;
  parameters: ParameterDto[];
  childNodes: PredicateNodeDto[];
  responseGenerator: ResponseGeneratorDto | undefined;
}
