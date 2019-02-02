import { ResponseGeneratorTemplateData } from 'src/domain/response-generator-template';

export const STATIC: ResponseGeneratorTemplateData = {
  name: 'Static',
  description: 'Response generators based on this template return a static configured response.',
  generatorFunctionBody: 'return { statusCode: parameters["Status Code"], body: parameters["Body"], contentType: parameters["Content Type"] };',
  parameters: [
    {
      name: 'Status Code',
      description: 'The HTTP status code of the response',
      isRequired: true,
      valueType: 'number',
      defaultValue: 204,
    },
    {
      name: 'Body',
      description: 'The body of the response',
      isRequired: false,
      valueType: 'string',
      defaultValue: '',
    },
    {
      name: 'Content Type',
      description: 'The content type of the response',
      isRequired: false,
      valueType: 'string',
      defaultValue: 'application/json',
    },
  ],
};
