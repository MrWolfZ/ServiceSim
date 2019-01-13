import axios from 'axios';
import Vue from 'vue';
import { getStoreBuilder } from 'vuex-typex';
import { createDiff, isEmpty } from '../../util';
import {
  CreatePredicateTemplateCommand,
  CreatePredicateTemplateCommandResponse,
  DeletePredicateTemplateCommand,
  PredicateTemplateData,
  PredicateTemplateDto,
  PredicateTemplateState,
  UpdatePredicateTemplateCommand,
} from './predicate-template.types';

export interface PredicateTemplatesState {
  templateIds: string[];
  templatesById: { [templateId: string]: PredicateTemplateState };
}

const b = getStoreBuilder<{}>().module<PredicateTemplatesState>('predicateTemplates', {
  templateIds: [],
  templatesById: {},
});

export function getAll(state: PredicateTemplatesState) {
  return state.templateIds.map(id => state.templatesById[id]);
}

export function addAll(state: PredicateTemplatesState, templates: PredicateTemplateState[]) {
  templates.forEach(t => addOrReplace(state, t));
}

export function addOrReplace(state: PredicateTemplatesState, template: PredicateTemplateState) {
  if (!state.templateIds.includes(template.id)) {
    state.templateIds.push(template.id);
  }

  Vue.set(state.templatesById, template.id, template);
}

export function deleteTemplate(state: PredicateTemplatesState, templateId: string) {
  state.templateIds.splice(state.templateIds.indexOf(templateId), 1);
  Vue.delete(state.templatesById, templateId);
}

export function reset(state: PredicateTemplatesState) {
  state.templateIds = [];
  state.templatesById = {};
}

export async function loadAllAsync() {
  const response = await axios.get<PredicateTemplateDto[]>(`/predicate-templates`);
  predicateTemplates.addAll(response.data);
}

export async function createAsync(_: any, data: PredicateTemplateData) {
  const command: CreatePredicateTemplateCommand = {
    ...data,
  };

  const response = await axios.post<CreatePredicateTemplateCommandResponse>(`/predicate-templates/create`, command);

  const template: PredicateTemplateState = {
    id: response.data.templateId,
    version: response.data.templateVersion,
    ...data,
  };

  predicateTemplates.addOrReplace(template);
}

export async function updateAsync(_: any, args: { templateId: string; data: PredicateTemplateData }) {
  const originalTemplate = predicateTemplates.state.templatesById[args.templateId];
  const template: PredicateTemplateState = {
    ...predicateTemplates.state.templatesById[args.templateId],
    version: originalTemplate.version + 1,
    ...args.data,
  };

  const command: UpdatePredicateTemplateCommand = {
    templateId: args.templateId,
    unmodifiedTemplateVersion: originalTemplate.version,
    diff: createDiff(originalTemplate, args.data),
  };

  if (isEmpty(command.diff)) {
    return;
  }

  predicateTemplates.addOrReplace(template);
  await axios.post(`/predicate-templates/update`, command);
}

export async function deleteAsync(_: any, templateId: string) {
  predicateTemplates.delete(templateId);

  const command: DeletePredicateTemplateCommand = {
    templateId,
    unmodifiedTemplateVersion: 1,
  };

  await axios.post(`/predicate-templates/delete`, command);
}

const state$ = b.state();
const getAll$ = b.read(getAll);
export const predicateTemplates = {
  get state() { return state$(); },
  get all() { return getAll$(); },

  addAll: b.commit(addAll),
  addOrReplace: b.commit(addOrReplace),
  delete: b.commit(deleteTemplate),
  reset: b.commit(reset),

  loadAllAsync: b.dispatch(loadAllAsync),
  createAsync: b.dispatch(createAsync),
  updateAsync: b.dispatch(updateAsync),
  deleteAsync: b.dispatch(deleteAsync),
};

export default predicateTemplates;
