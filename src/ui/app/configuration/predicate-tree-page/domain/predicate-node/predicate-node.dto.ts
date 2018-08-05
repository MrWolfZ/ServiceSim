import { PredicateTemplateVersionSnapshotDto } from '../predicate-template/predicate-template.dto';
import { ResponseGeneratorTemplateSnapshotDto } from '../response-generator-template/response-generator-template.dto';

export interface ResponseGeneratorDto {
  name: string;
  templateInstanceOrGeneratorFunctionBody: {
    templateSnapshot: ResponseGeneratorTemplateSnapshotDto;
    parameterValues: { [prop: string]: string | number | boolean };
  } | string;
}

export interface PredicateNodeDto {
  nodeId: string;
  name: string;
  templateInstanceOrEvalFunctionBody: {
    templateSnapshot: PredicateTemplateVersionSnapshotDto;
    parameterValues: { [prop: string]: string | number | boolean };
  } | string;
  childNodeIdsOrResponseGenerator: string[] | ResponseGeneratorDto | undefined;
  isTopLevelNode: boolean;
}
