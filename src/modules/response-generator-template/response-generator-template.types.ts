import { VersionedRootEntity, VersionedRootEntityDefinition } from '../../api-infrastructure/api-infrastructure.types';
import { Parameter } from '../parameter/parameter.types';

export interface ResponseGeneratorTemplateData {
  name: string;
  description: string;
  generatorFunctionBody: string;
  parameters: Parameter[];
}

export type ResponseGeneratorTemplateEntityType = 'response-generator-template';

export interface ResponseGeneratorTemplateEntity
  extends ResponseGeneratorTemplateData, VersionedRootEntity<ResponseGeneratorTemplateEntity, ResponseGeneratorTemplateEntityType> { }

export type ResponseGeneratorTemplateEntityDefinition
  = VersionedRootEntityDefinition<ResponseGeneratorTemplateEntity, ResponseGeneratorTemplateEntityType>;

export interface ResponseGeneratorTemplateDto extends ResponseGeneratorTemplateData {
  id: string;
  version: number;
}

export interface ResponseGeneratorTemplateState extends ResponseGeneratorTemplateDto { }

export interface CreateResponseGeneratorTemplateCommand extends ResponseGeneratorTemplateData { }

export interface UpdateResponseGeneratorTemplateCommand extends Partial<ResponseGeneratorTemplateData> {
  templateId: string;
  unmodifiedTemplateVersion: number;
}

export interface DeleteResponseGeneratorTemplateCommand {
  templateId: string;
  unmodifiedTemplateVersion: number;
}
