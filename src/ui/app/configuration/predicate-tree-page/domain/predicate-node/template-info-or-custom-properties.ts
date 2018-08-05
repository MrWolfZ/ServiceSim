import {
  PredicateCustomPropertiesDto,
  PredicateTemplateInfoDto,
  ResponseGeneratorCustomPropertiesDto,
  ResponseGeneratorTemplateInfoDto,
} from './predicate-node.dto';

export interface ResponseGeneratorTemplateInfo extends ResponseGeneratorTemplateInfoDto {

}

export interface ResponseGeneratorCustomProperties extends ResponseGeneratorCustomPropertiesDto {

}

export function isResponseGeneratorTemplateInfo(
  value: any,
): value is ResponseGeneratorTemplateInfo {
  return !!(value as ResponseGeneratorTemplateInfo).templateSnapshot;
}

export function isResponseGeneratorCustomProperties(
  value: any,
): value is ResponseGeneratorCustomProperties {
  return !!(value as ResponseGeneratorCustomProperties).generateFunctionBody;
}

export interface PredicateTemplateInfo extends PredicateTemplateInfoDto {

}

export interface PredicateCustomProperties extends PredicateCustomPropertiesDto {

}

export function isPredicateTemplateInfo(
  value: any,
): value is PredicateTemplateInfo {
  return !!(value as PredicateTemplateInfo).templateSnapshot;
}

export function isPredicateCustomProperties(
  value: any,
): value is PredicateCustomProperties {
  return !!(value as PredicateCustomProperties).evalFunctionBody;
}
