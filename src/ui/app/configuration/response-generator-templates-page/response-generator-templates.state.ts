import { RootState as AppRootState } from 'app/app.state';

export interface RootState extends AppRootState {
  responseGeneratorTemplatesPage: ResponseGeneratorTemplatesPageState;
}

export interface ResponseGeneratorTemplatesPageDto {

}

export interface ResponseGeneratorTemplatesPageState extends ResponseGeneratorTemplatesPageDto {

}

export const INITIAL_RESPONSE_GENERATOR_TEMPLATES_PAGE_STATE: ResponseGeneratorTemplatesPageState = {

};

export const RESPONSE_GENERATOR_TEMPLATES_PAGE_STATE_FEATURE_NAME = 'responseGeneratorTemplatesPage';
