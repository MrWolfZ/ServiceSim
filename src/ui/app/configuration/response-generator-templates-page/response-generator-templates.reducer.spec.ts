import { InitializeResponseGeneratorTemplatesPageAction } from './response-generator-templates.actions';
import { responseGeneratorTemplatesPageReducer } from './response-generator-templates.reducer';
import { INITIAL_RESPONSE_GENERATOR_TEMPLATES_PAGE_STATE, ResponseGeneratorTemplatesPageDto } from './response-generator-templates.state';

export const MOCK_RESPONSE_GENERATOR_TEMPLATES_PAGE_DTO: ResponseGeneratorTemplatesPageDto = {

};

describe(responseGeneratorTemplatesPageReducer.name, () => {
  it('should return the initial state when called with undefined state', () => {
    expect(responseGeneratorTemplatesPageReducer(undefined, { type: 'INIT' } as any)).toBeDefined();
  });

  it('should return the modified state when called with initialization action', () => {
    const initializedState = responseGeneratorTemplatesPageReducer(
      INITIAL_RESPONSE_GENERATOR_TEMPLATES_PAGE_STATE,
      new InitializeResponseGeneratorTemplatesPageAction(MOCK_RESPONSE_GENERATOR_TEMPLATES_PAGE_DTO),
    );

    expect(initializedState).not.toBe(INITIAL_RESPONSE_GENERATOR_TEMPLATES_PAGE_STATE);
  });
});
