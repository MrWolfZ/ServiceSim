import { PredicateTemplateVersionSnapshotDto } from '../predicate-template/predicate-template.dto';
import { ResponseGeneratorTemplateVersionSnapshotDto } from '../response-generator-template/response-generator-template.dto';

export interface ResponseGeneratorDto {
  templateVersionSnapshot: ResponseGeneratorTemplateVersionSnapshotDto;
  name: string;
  parameterValues: { [prop: string]: string | number | boolean };
}

export interface PredicateNodeDto {
  nodeId: string;
  predicateTemplateVersionSnapshot: PredicateTemplateVersionSnapshotDto;
  name: string;
  parameterValues: { [prop: string]: string | number | boolean };
  childNodeIdsOrResponseGenerator: string[] | ResponseGeneratorDto | undefined;
  isTopLevelNode: boolean;
}
