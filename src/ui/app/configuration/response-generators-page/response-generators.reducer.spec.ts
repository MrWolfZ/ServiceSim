import { InitializeResponseGeneratorsPageAction } from './response-generators.actions';
import { responseGeneratorsPageReducer } from './response-generators.reducer';
import { INITIAL_RESPONSE_GENERATORS_PAGE_STATE, ResponseGeneratorsPageDto } from './response-generators.state';

export const MOCK_RESPONSE_GENERATORS_PAGE_DTO: ResponseGeneratorsPageDto = {

};

describe(responseGeneratorsPageReducer.name, () => {
  it('should return the initial state when called with undefined state', () => {
    expect(responseGeneratorsPageReducer(undefined, { type: 'INIT' } as any)).toBeDefined();
  });

  it('should return the modified state when called with initialization action', () => {
    const initializedState = responseGeneratorsPageReducer(
      INITIAL_RESPONSE_GENERATORS_PAGE_STATE,
      new InitializeResponseGeneratorsPageAction(MOCK_RESPONSE_GENERATORS_PAGE_DTO),
    );

    expect(initializedState).not.toBe(INITIAL_RESPONSE_GENERATORS_PAGE_STATE);
  });
});
