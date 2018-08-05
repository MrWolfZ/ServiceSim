import { PredicateTemplateSnapshotDto } from '../predicate-template/predicate-template.dto';
import { ResponseGeneratorTemplateSnapshotDto } from '../response-generator-template/response-generator-template.dto';

export interface ResponseGeneratorDto {
  name: string;
  description: string;
  templateInfoOrCustomProperties: ResponseGeneratorTemplateInfoDto | ResponseGeneratorCustomPropertiesDto;
}

export interface PredicateNodeDto {
  nodeId: string;
  name: string;
  description: string;
  templateInfoOrCustomProperties: PredicateTemplateInfoDto | PredicateCustomPropertiesDto;
  childNodeIdsOrResponseGenerator: string[] | ResponseGeneratorDto | undefined;
  isTopLevelNode: boolean;
}

export interface ResponseGeneratorTemplateInfoDto {
  templateSnapshot: ResponseGeneratorTemplateSnapshotDto;
  parameterValues: { [prop: string]: string | number | boolean };
}

export interface ResponseGeneratorCustomPropertiesDto {
  generateFunctionBody: string;
}

export interface PredicateTemplateInfoDto {
  templateSnapshot: PredicateTemplateSnapshotDto;
  parameterValues: { [prop: string]: string | number | boolean };
}

export interface PredicateCustomPropertiesDto {
  evalFunctionBody: string;
}
