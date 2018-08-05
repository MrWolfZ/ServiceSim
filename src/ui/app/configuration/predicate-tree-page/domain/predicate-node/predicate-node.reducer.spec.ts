import { PredicateNodeDto } from './predicate-node.dto';
import { predicateNodeReducer } from './predicate-node.reducer';

export const MOCK_PREDICATE_NODE_DTO: PredicateNodeDto = {
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
};

describe(predicateNodeReducer.name, () => {
  it('should return the initial state when called with undefined state', () => {
    expect(predicateNodeReducer(undefined, { type: 'INIT' } as any)).toBeDefined();
  });
});
