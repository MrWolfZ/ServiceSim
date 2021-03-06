import axios from 'axios';
import uuid from 'uuid';
import Vue from 'vue';
import { getStoreBuilder } from 'vuex-typex';
import {
  CreatePredicateTemplateCommand,
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

export async function loadAllAsync() {
  const response = await axios.get<PredicateTemplateDto[]>(`/predicate-templates`);
  predicateTemplates.addAll(response.data);
}

export async function createAsync(_: any, data: PredicateTemplateData) {
  const templateId = `predicateTemplate.${uuid()}`;
  const template: PredicateTemplateState = {
    id: templateId,
    version: 1,
    ...data,
  };

  const command: CreatePredicateTemplateCommand = {
    templateId,
    data,
  };

  predicateTemplates.addOrReplace(template);
  await axios.post(`/predicate-templates/create`, command);
}

export async function updateAsync(_: any, args: { templateId: string; data: PredicateTemplateData }) {
  const originalTemplate = predicateTemplates.state.templatesById[args.templateId];
  const template: PredicateTemplateState = {
    ...predicateTemplates.state.templatesById[args.templateId],
    version: originalTemplate.version + 1,
    ...args.data,
  };

  const command: UpdatePredicateTemplateCommand = {
    ...args,
    unmodifiedTemplateVersion: originalTemplate.version,
  };

  predicateTemplates.addOrReplace(template);
  await axios.post(`/predicate-templates/update`, command);
}

export async function deleteAsync(_: any, templateId: string) {
  predicateTemplates.delete(templateId);
  await axios.delete(`/predicate-templates/${templateId}`);
}

const state$ = b.state();
const getAll$ = b.read(getAll);
const predicateTemplates = {
  get state() { return state$(); },
  get all() { return getAll$(); },

  addAll: b.commit(addAll),
  addOrReplace: b.commit(addOrReplace),
  delete: b.commit(deleteTemplate),

  loadAllAsync: b.dispatch(loadAllAsync),
  createAsync: b.dispatch(createAsync),
  updateAsync: b.dispatch(updateAsync),
  deleteAsync: b.dispatch(deleteAsync),
};

export default predicateTemplates;
