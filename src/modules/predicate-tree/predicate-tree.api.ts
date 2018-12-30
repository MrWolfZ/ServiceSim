import express from 'express';
import { EventLog, requestHandler } from '../../api-infrastructure';
import { assertNever } from '../../util/assert';
import { ChildPredicateNodeAdded, PredicateNodeCreated, ResponseGeneratorSet } from './predicate-node.events';
import { PredicateNodeDto } from './predicate-node.types';

const SUBSCRIBED_EVENT_KINDS: SubscribedEvents['kind'][] = [
  PredicateNodeCreated.KIND,
  ChildPredicateNodeAdded.KIND,
  ResponseGeneratorSet.KIND,
];

type SubscribedEvents =
  | PredicateNodeCreated
  | ChildPredicateNodeAdded
  | ResponseGeneratorSet
  ;

const getAllResponse: PredicateNodeDto[] = [];

export function start() {
  return EventLog.getStream<SubscribedEvents>(SUBSCRIBED_EVENT_KINDS).subscribe(ev => {
    switch (ev.kind) {
      case PredicateNodeCreated.KIND: {
        const dto: PredicateNodeDto = {
          id: ev.nodeId,
          version: 1,
          ...ev.data,
        };

        getAllResponse.push(dto);
        return;
      }

      case ChildPredicateNodeAdded.KIND: {
        return;
      }

      case ResponseGeneratorSet.KIND: {
        return;
      }

      default:
        return assertNever(ev);
    }
  });
}

export function getAllAsync() {
  // return getAllResponse;
  return getMockData();
}

export const api = express.Router();
api.get('/nodes', requestHandler(getAllAsync));

function getMockData(): PredicateNodeDto[] {
  return [
    {
      id: '0',
      version: 1,
      name: 'root',
      description: 'root',
      templateInfoOrEvalFunctionBody: 'return true;',
      childNodeIdsOrResponseGenerator: [
        '1',
        '2',
        '3',
        '4',
      ],
    },
    {
      id: '1',
      version: 1,
      name: 'My Path Prefix',
      description: 'Book API requests',
      templateInfoOrEvalFunctionBody: {
        templateId: 'predicate-templates/1',
        templateVersion: 1,
        templateDataSnapshot: {
          name: 'Path Prefix',
          description: 'Foo',
          evalFunctionBody: 'return true;',
          parameters: [
            {
              name: 'Prefix',
              description: 'Prefix',
              isRequired: true,
              valueType: 'string',
              defaultValue: '/',
            },
          ],
        },
        parameterValues: {
          'Prefix': '/api/books',
        },
      },
      childNodeIdsOrResponseGenerator: [
        '1.1',
        '1.2',
      ],
    },
    {
      id: '1.1',
      version: 1,
      name: 'My Path Pattern',
      description: 'Single book requests',
      templateInfoOrEvalFunctionBody: {
        templateId: 'predicate-templates/2',
        templateVersion: 1,
        templateDataSnapshot: {
          name: 'Path Pattern',
          description: 'Foo',
          evalFunctionBody: 'return true;',
          parameters: [
            {
              name: 'Pattern',
              description: 'Pattern',
              isRequired: true,
              valueType: 'string',
              defaultValue: '/',
            },
            {
              name: 'Foo',
              description: 'Foo',
              isRequired: true,
              valueType: 'boolean',
              defaultValue: true,
            },
            {
              name: 'Bar',
              description: 'Bar',
              isRequired: true,
              valueType: 'number',
              defaultValue: 1,
            },
          ],
        },
        parameterValues: {
          'Pattern': '/api/books/:bookId',
          'Foo': false,
          'Bar': 100,
        },
      },
      childNodeIdsOrResponseGenerator: [
        '1.1.1',
      ],
    },
    {
      id: '1.1.1',
      version: 1,
      name: 'My POST',
      description: '',
      templateInfoOrEvalFunctionBody: {
        templateId: 'predicate-templates/3',
        templateVersion: 1,
        templateDataSnapshot: {
          name: 'POST',
          description: 'POST',
          evalFunctionBody: 'return true;',
          parameters: [],
        },
        parameterValues: {},
      },
      childNodeIdsOrResponseGenerator: {
        name: 'My Custom Code',
        description: 'Return book',
        templateInfoOrGeneratorFunctionBody: 'return { statusCode: 200, body: "[{"Name":"LOTR"}]", contentType: "application/json" };',
      },
    },
    {
      id: '1.2',
      version: 1,
      name: 'My GET',
      description: '',
      templateInfoOrEvalFunctionBody: {
        templateId: 'predicate-templates/4',
        templateVersion: 1,
        templateDataSnapshot: {
          name: 'GET',
          description: 'GET',
          evalFunctionBody: 'return true;',
          parameters: [],
        },
        parameterValues: {},
      },
      childNodeIdsOrResponseGenerator: undefined,
    },
    {
      id: '2',
      version: 1,
      name: 'My Allowed Methods',
      description: '',
      templateInfoOrEvalFunctionBody: {
        templateId: 'predicate-templates/5',
        templateVersion: 1,
        templateDataSnapshot: {
          name: 'Allowed Methods',
          description: 'Allowed Methods',
          evalFunctionBody: 'return true;',
          parameters: [
            {
              name: 'Allowed Methods',
              description: 'Allowed Methods',
              isRequired: true,
              valueType: 'string',
              defaultValue: 'POST,PUT,DELETE',
            },
          ],
        },
        parameterValues: {
          'Allowed Methods': 'PUT,DELETE',
        },
      },
      childNodeIdsOrResponseGenerator: {
        name: 'My No Content',
        description: '',
        templateInfoOrGeneratorFunctionBody: {
          templateId: 'response-generator-templates/2',
          templateVersion: 1,
          templateDataSnapshot: {
            name: 'No Content',
            description: 'No Content',
            generatorFunctionBody: 'return { statusCode: 204, body: "", contentType: "" }',
            parameters: [],
          },
          parameterValues: {},
        },
      },
    },
    {
      id: '3',
      version: 1,
      name: 'My GET 2',
      description: 'File requests',
      templateInfoOrEvalFunctionBody: {
        templateId: 'predicate-templates/4',
        templateVersion: 1,
        templateDataSnapshot: {
          name: 'GET',
          description: 'GET',
          evalFunctionBody: 'return true;',
          parameters: [],
        },
        parameterValues: {},
      },
      childNodeIdsOrResponseGenerator: {
        name: 'My Static File',
        description: 'return specific file',
        templateInfoOrGeneratorFunctionBody: {
          templateId: 'response-generator-templates/3',
          templateVersion: 1,
          templateDataSnapshot: {
            name: 'Static File',
            description: 'Static File',
            generatorFunctionBody: 'return { statusCode: 200, body: "", contentType: "application/blob" };',
            parameters: [
              {
                name: 'File Path',
                description: 'File Path',
                isRequired: true,
                valueType: 'string',
                defaultValue: '',
              },
            ],
          },
          parameterValues: {
            'File Path': '/home/files/path',
          },
        },
      },
    },
    {
      id: '4',
      version: 1,
      name: 'My Custom Predicate',
      description: 'Some custom code',
      templateInfoOrEvalFunctionBody: 'return true;',
      childNodeIdsOrResponseGenerator: {
        name: 'My Static File',
        description: '',
        templateInfoOrGeneratorFunctionBody: {
          templateId: 'response-generator-templates/3',
          templateVersion: 1,
          templateDataSnapshot: {
            name: 'Static File',
            description: 'Static File',
            generatorFunctionBody: 'return { statusCode: 200, body: "", contentType: "application/blob" };',
            parameters: [
              {
                name: 'File Path',
                description: 'File Path',
                isRequired: true,
                valueType: 'string',
                defaultValue: '',
              },
            ],
          },
          parameterValues: {
            'File Path': '/home/files/path',
          },
        },
      },
    },
  ];
}
