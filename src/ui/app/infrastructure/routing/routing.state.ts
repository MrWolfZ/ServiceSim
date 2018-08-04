export interface Route {
  pathParts: any[];
  queryParams: object;
}

export interface AppRouteParams {
}

export interface AppRouteQueryParams {
}

export const INFRASTRUCTURE_MODULE_PATH = 'infrastructure';

export const CONFIGURATION_MODULE_PATH = 'configuration';

export interface ConfigurationRouteParams {
}

export interface ConfigurationRouteQueryParams {
}

export const PREDICATE_TREE_PAGE_PATH = 'predicate-tree';
export const PREDICATE_TEMPLATES_PAGE_PATH = 'predicate-templates';
export const RESPONSE_GENERATOR_TEMPLATES_PAGE_PATH = 'response-generator-templates';
