import { InitializeResponseGeneratorTemplatesPageAction, ResponseGeneratorTemplatesPageActions } from './response-generator-templates.actions';
import { INITIAL_RESPONSE_GENERATOR_TEMPLATES_PAGE_STATE, ResponseGeneratorTemplatesPageState } from './response-generator-templates.state';

export function responseGeneratorTemplatesPageReducer(
  state = INITIAL_RESPONSE_GENERATOR_TEMPLATES_PAGE_STATE,
  action: ResponseGeneratorTemplatesPageActions,
): ResponseGeneratorTemplatesPageState {
  switch (action.type) {
    case InitializeResponseGeneratorTemplatesPageAction.TYPE:
      return {
        ...state,
        ...action.dto,
      };

    default:
      return state;
  }
}
