import { PredicateTemplateSnapshot } from './predicate-template-snapshot';
import { ResponseGeneratorTemplateSnapshot } from './response-generator-template-snapshot';

export interface ResponseGeneratorTemplateInfo {
  templateSnapshot: ResponseGeneratorTemplateSnapshot;
  parameterValues: { [prop: string]: string | number | boolean };
}

export interface ResponseGeneratorCustomProperties {
  generateFunctionBody: string;
}

export function isResponseGeneratorTemplateInfo(
  value: any,
): value is ResponseGeneratorTemplateInfo {
  return !!(value as ResponseGeneratorTemplateInfo).templateSnapshot;
}

export function isResponseGeneratorCustomPropertes(
  value: any,
): value is ResponseGeneratorCustomProperties {
  return !!(value as ResponseGeneratorCustomProperties).generateFunctionBody;
}

export interface PredicateTemplateInfo {
  templateSnapshot: PredicateTemplateSnapshot;
  parameterValues: { [prop: string]: string | number | boolean };
}

export interface PredicateCustomProperties {
  evalFunctionBody: string;
}

export function isPredicateTemplateInfo(
  value: any,
): value is PredicateTemplateInfo {
  return !!(value as PredicateTemplateInfo).templateSnapshot;
}

export function isPredicateCustomPropertes(
  value: any,
): value is PredicateCustomProperties {
  return !!(value as PredicateCustomProperties).evalFunctionBody;
}
