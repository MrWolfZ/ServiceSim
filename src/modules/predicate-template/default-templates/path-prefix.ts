import { PredicateTemplateData } from '../predicate-template.types';

export const PATH_PREFIX: PredicateTemplateData = {
  name: 'Path Prefix',
  description: 'Predicates based on this template match all requests whose path starts with a provided string.',
  evalFunctionBody: 'return request.path.startsWith(parameters["Prefix"]);',
  parameters: [
    {
      name: 'Prefix',
      description: 'The prefix to check the path for.',
      isRequired: true,
      valueType: 'string',
      defaultValue: '/',
    },
  ],
};
