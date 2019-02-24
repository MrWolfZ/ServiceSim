import { EngineConfigurationAggregate } from './engine-configuration';

export interface TemplateInfo {
  templateId: string;
  parameterValues: { [prop: string]: string | number | boolean };
}

export type Condition = TemplateInfo | string;

export interface Responder {
  conditions: Condition[];
  templateInfoOrCustomFunctionBody: TemplateInfo | string;
}

export enum Method {
  GET,
  PUT,
  POST,
  PATCH,
  DELETE,
  OPTIONS,
  HEAD,
  CONNECT,
  TRACE,
}

export interface ServiceOperationData {
  name: string;
  description: string;
  pathRegex: string;
  methods: Method[];
  conditions: Condition[];
  responders: Responder[];
}

export const SERVICE_OPERATION_AGGREGATE_TYPE = 'ServiceOperation';
export type ServiceOperationAggregateType = typeof SERVICE_OPERATION_AGGREGATE_TYPE;

export type ServiceOperationAggregate = ServiceOperationData & EngineConfigurationAggregate<ServiceOperationAggregateType>;
