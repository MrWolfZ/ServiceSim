import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { addAskMockResponse, ask } from 'app/infrastructure';

import { InitializePredicateTreePageAction, LoadPredicateTreePageDataAction } from './predicate-tree.actions';
import { ASK_FOR_PREDICATE_TREE_PAGE_DTO, PredicateTreePageDto } from './predicate-tree.dto';

addAskMockResponse<typeof ASK_FOR_PREDICATE_TREE_PAGE_DTO, any, PredicateTreePageDto>(
  ASK_FOR_PREDICATE_TREE_PAGE_DTO,
  {
    nodes: [
      {
        nodeId: '1',
        name: 'My Path Prefix',
        templateInstanceOrEvalFunctionBody: {
          templateSnapshot: {
            templateId: 'predicate-templates/1',
            version: 1,
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
        isTopLevelNode: true,
      },
      {
        nodeId: '1.1',
        name: 'My Path Pattern',
        templateInstanceOrEvalFunctionBody: {
          templateSnapshot: {
            templateId: 'predicate-templates/2',
            version: 1,
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
        isTopLevelNode: false,
      },
      {
        nodeId: '1.1.1',
        name: 'My POST',
        templateInstanceOrEvalFunctionBody: {
          templateSnapshot: {
            templateId: 'predicate-templates/3',
            version: 1,
            name: 'POST',
            description: 'POST',
            evalFunctionBody: 'return true;',
            parameters: [],
          },
          parameterValues: {},
        },
        childNodeIdsOrResponseGenerator: {
          name: 'My Custom Code',
          templateInstanceOrGeneratorFunctionBody: 'return { statusCode: 200, body: "[{"Name":"LOTR"}]", contentType: "application/json" };',
        },
        isTopLevelNode: false,
      },
      {
        nodeId: '1.2',
        name: 'My GET',
        templateInstanceOrEvalFunctionBody: {
          templateSnapshot: {
            templateId: 'predicate-templates/4',
            version: 1,
            name: 'GET',
            description: 'GET',
            evalFunctionBody: 'return true;',
            parameters: [],
          },
          parameterValues: {},
        },
        childNodeIdsOrResponseGenerator: undefined,
        isTopLevelNode: false,
      },
      {
        nodeId: '2',
        name: 'My Allowed Methods',
        templateInstanceOrEvalFunctionBody: {
          templateSnapshot: {
            templateId: 'predicate-templates/5',
            version: 1,
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
          templateInstanceOrGeneratorFunctionBody: {
            templateSnapshot: {
              templateId: 'response-generator-templates/2',
              version: 1,
              name: 'No Content',
              description: 'No Content',
              generatorFunctionBody: 'return { statusCode: 204, body: "", contentType: "" }',
              parameters: [],
            },
            parameterValues: {},
          },
        },
        isTopLevelNode: true,
      },
      {
        nodeId: '3',
        name: 'My GET 2',
        templateInstanceOrEvalFunctionBody: {
          templateSnapshot: {
            templateId: 'predicate-templates/4',
            version: 1,
            name: 'GET',
            description: 'GET',
            evalFunctionBody: 'return true;',
            parameters: [],
          },
          parameterValues: {},
        },
        childNodeIdsOrResponseGenerator: {
          name: 'My Static File',
          templateInstanceOrGeneratorFunctionBody: {
            templateSnapshot: {
              templateId: 'response-generator-templates/3',
              version: 1,
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
        isTopLevelNode: true,
      },
      {
        nodeId: '4',
        name: 'My Custom Predicate',
        templateInstanceOrEvalFunctionBody: 'return true;',
        childNodeIdsOrResponseGenerator: {
          name: 'My Static File',
          templateInstanceOrGeneratorFunctionBody: {
            templateSnapshot: {
              templateId: 'response-generator-templates/3',
              version: 1,
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
        isTopLevelNode: true,
      },
    ],
  },
);

@Injectable()
export class PredicateTreePageEffects {

  @Effect()
  loadPageData$: Observable<Action> = this.actions$.pipe(
    ofType(LoadPredicateTreePageDataAction.TYPE),
    flatMap(() =>
      ask(
        this.http,
        ASK_FOR_PREDICATE_TREE_PAGE_DTO,
        dto => [
          new InitializePredicateTreePageAction(dto),
        ],
      )
    ),
  );

  constructor(private actions$: Actions, private http: HttpClient) { }
}
