import { InitializeResponseGeneratorsPageAction, ResponseGeneratorsPageActions } from './response-generators.actions';
import { INITIAL_RESPONSE_GENERATORS_PAGE_STATE, ResponseGeneratorsPageState } from './response-generators.state';

export function responseGeneratorsPageReducer(
  state = INITIAL_RESPONSE_GENERATORS_PAGE_STATE,
  action: ResponseGeneratorsPageActions,
): ResponseGeneratorsPageState {
  switch (action.type) {
    case InitializeResponseGeneratorsPageAction.TYPE:
      return {
        ...state,
        ...action.dto,
      };

    default:
      return state;
  }
}
