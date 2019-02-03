import { PredicateTemplateData } from 'src/domain/predicate-template';

export const METHOD: PredicateTemplateData = {
  name: 'Method',
  description: 'Match all requests that have one of a specified list of methods.',
  tags: ['method'],
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
