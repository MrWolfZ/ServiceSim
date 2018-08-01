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
    topLevelNodes: [
      {
        nodeId: '1',
        predicateKindName: 'Path Prefix',
        parameters: [
          {
            name: 'Prefix',
            value: '/api/books',
          },
        ],
        childNodes: [
          {
            nodeId: '1.1',
            predicateKindName: 'Path Pattern',
            parameters: [
              {
                name: 'Pattern',
                value: '/api/books/:bookId',
              },
              {
                name: 'Foo',
                value: 'Bar',
              },
              {
                name: 'Tick',
                value: 'Tock',
              },
            ],
            childNodes: [
              {
                nodeId: '1.1.1',
                predicateKindName: 'POST',
                parameters: [],
                childNodes: [],
                responseGenerator: {
                  responseGeneratorKindName: 'Custom Code',
                  parameters: [
                    {
                      name: 'Code',
                      value: 'return { statusCode: 200, body: \'[{\"name\":\"LOTR\"}]\', contentType: "application/json" };',
                    },
                  ],
                },
              },
            ],
            responseGenerator: undefined,
          },
          {
            nodeId: '1.2',
            predicateKindName: 'GET',
            parameters: [],
            childNodes: [],
            responseGenerator: undefined,
          },
        ],
        responseGenerator: undefined,
      },
      {
        nodeId: '2',
        predicateKindName: 'Method',
        parameters: [
          {
            name: 'Allowed Methods',
            value: 'POST,PUT,DELETE',
          },
        ],
        childNodes: [],
        responseGenerator: {
          responseGeneratorKindName: 'No Content',
          parameters: [],
        },
      },
      {
        nodeId: '3',
        predicateKindName: 'GET',
        parameters: [],
        childNodes: [],
        responseGenerator: {
          responseGeneratorKindName: 'Static File',
          parameters: [
            {
              name: 'File Path',
              value: '/home/files/path',
            },
          ],
        },
      },
    ],
    nodeDetailsByNodeId: {
      '1': {
        nodeId: '1',
        predicateKindName: 'Path Prefix',
        childNodes: [
          {
            nodeId: '1.1',
            predicateKindName: 'Path Pattern',
          },
          {
            nodeId: '1.2',
            predicateKindName: 'GET',
          },
        ],
        parameters: [
          {
            name: 'Prefix',
            value: '/api/books',
          },
        ],
        responseGenerator: undefined,
      },
      '1.1': {
        nodeId: '1.1',
        predicateKindName: 'Path Pattern',
        childNodes: [
          {
            nodeId: '1.1.1',
            predicateKindName: 'POST',
          },
        ],
        parameters: [
          {
            name: 'Pattern',
            value: '/api/books/:bookId',
          },
          {
            name: 'Foo',
            value: 'Bar',
          },
          {
            name: 'Tick',
            value: 'Tock',
          },
        ],
        responseGenerator: undefined,
      },
      '1.1.1': {
        nodeId: '1.1.1',
        predicateKindName: 'POST',
        childNodes: [],
        parameters: [],
        responseGenerator: {
          responseGeneratorKindName: 'Custom Code',
          parameters: [
            {
              name: 'Code',
              value: 'return { statusCode: 200, body: \'[{\"name\":\"LOTR\"}]\', contentType: "application/json" };',
            },
          ],
        },
      },
      '1.2': {
        nodeId: '1.2',
        predicateKindName: 'GET',
        childNodes: [],
        parameters: [],
        responseGenerator: undefined,
      },
      '2': {
        nodeId: '2',
        predicateKindName: 'Method',
        childNodes: [],
        parameters: [
          {
            name: 'Allowed Methods',
            value: 'POST,PUT,DELETE',
          },
        ],
        responseGenerator: {
          responseGeneratorKindName: 'No Content',
          parameters: [],
        },
      },
      '3': {
        nodeId: '3',
        predicateKindName: 'GET',
        childNodes: [],
        parameters: [],
        responseGenerator: {
          responseGeneratorKindName: 'Static File',
          parameters: [
            {
              name: 'File Path',
              value: '/home/files/path',
            },
          ],
        },
      },
    },
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
