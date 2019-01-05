import { PredicateTemplateData } from '../predicate-template.types';

export const METHOD: PredicateTemplateData = {
  name: 'Method',
  description: 'Predicates based on this template match all requests that have one of a specified list of methods.',
  evalFunctionBody: 'return parameters["Allowed Methods"].split(",").map(m => m.trim().toUpperCase()).includes(request.method.toUpperCase());',
  parameters: [
    {
      name: 'Allowed Methods',
      description: 'A comma separated list of methods to match.',
      isRequired: true,
      valueType: 'string',
      defaultValue: 'GET,POST,PUT,DELETE',
    },
  ],
};
