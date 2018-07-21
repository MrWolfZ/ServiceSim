import { RootState as AppRootState } from 'app/app.state';

export interface RootState extends AppRootState {
  responseGenerators: ResponseGeneratorsPageState;
}

export interface ResponseGeneratorsPageDto {

}

export interface ResponseGeneratorsPageState extends ResponseGeneratorsPageDto {

}

export const INITIAL_RESPONSE_GENERATORS_PAGE_STATE: ResponseGeneratorsPageState = {

};

export const RESPONSE_GENERATORS_PAGE_STATE_FEATURE_NAME = 'responseGenerators';
