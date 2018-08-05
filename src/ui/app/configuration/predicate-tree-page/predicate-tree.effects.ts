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
        predicateTemplateVersionSnapshot: {
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
        name: 'My Path Prefix',
        parameterValues: {
          'Prefix': '/api/books',
        },
        childNodeIdsOrResponseGenerator: [
          '1.1',
          '1.2',
        ],
        isTopLevelNode: true,
      },
      {
        nodeId: '1.1',
        predicateTemplateVersionSnapshot: {
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
        name: 'My Path Pattern',
        parameterValues: {
          'Pattern': '/api/books/:bookId',
          'Foo': false,
          'Bar': 100,
        },
        childNodeIdsOrResponseGenerator: [
          '1.1.1',
        ],
        isTopLevelNode: false,
      },
      {
        nodeId: '1.1.1',
        predicateTemplateVersionSnapshot: {
          templateId: 'predicate-templates/3',
          version: 1,
          name: 'POST',
          description: 'POST',
          evalFunctionBody: 'return true;',
          parameters: [],
        },
        name: 'My POST',
        parameterValues: {},
        childNodeIdsOrResponseGenerator: {
          templateVersionSnapshot: {
            templateId: 'response-generator-templates/1',
            version: 1,
            name: 'Custom Code',
            description: 'Custom Code',
            generatorFunctionBody: 'return eval(parameters["Code"]);',
            parameters: [
              {
                name: 'Code',
                description: '',
                isRequired: true,
                valueType: 'string',
                defaultValue: 'return { statusCode: 204, body: "", contentType: "" };',
              },
            ],
          },
          name: 'My Custom Code',
          parameterValues: {
            'Code': 'return { statusCode: 200, body: "[{"Name":"LOTR"}]", contentType: "application/json" };',
          },
        },
        isTopLevelNode: false,
      },
      {
        nodeId: '1.2',
        predicateTemplateVersionSnapshot: {
          templateId: 'predicate-templates/4',
          version: 1,
          name: 'GET',
          description: 'GET',
          evalFunctionBody: 'return true;',
          parameters: [],
        },
        name: 'My GET',
        parameterValues: {},
        childNodeIdsOrResponseGenerator: undefined,
        isTopLevelNode: false,
      },
      {
        nodeId: '2',
        predicateTemplateVersionSnapshot: {
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
        name: 'My Allowed Methods',
        parameterValues: {
          'Allowed Methods': 'PUT,DELETE',
        },
        childNodeIdsOrResponseGenerator: {
          templateVersionSnapshot: {
            templateId: 'response-generator-templates/2',
            version: 1,
            name: 'No Content',
            description: 'No Content',
            generatorFunctionBody: 'return { statusCode: 204, body: "", contentType: "" }',
            parameters: [],
          },
          name: 'My No Content',
          parameterValues: {},
        },
        isTopLevelNode: true,
      },
      {
        nodeId: '3',
        predicateTemplateVersionSnapshot: {
          templateId: 'predicate-templates/4',
          version: 1,
          name: 'GET',
          description: 'GET',
          evalFunctionBody: 'return true;',
          parameters: [],
        },
        name: 'My GET 2',
        parameterValues: {},
        childNodeIdsOrResponseGenerator: {
          templateVersionSnapshot: {
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
          name: 'My Static File',
          parameterValues: {
            'File Path': '/home/files/path',
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
