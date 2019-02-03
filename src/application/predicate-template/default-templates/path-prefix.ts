import { PredicateTemplateData } from 'src/domain/predicate-template';

export const PATH_PREFIX: PredicateTemplateData = {
  name: 'Path Prefix',
  description: 'Match all requests whose path starts with a provided string.',
  tags: ['path', 'url'],
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
