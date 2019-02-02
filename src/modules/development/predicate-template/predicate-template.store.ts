import { createPredicateTemplate } from 'src/application/predicate-template/commands/create-predicate-template';
import { deletePredicateTemplate } from 'src/application/predicate-template/commands/delete-predicate-template';
import { updatePredicateTemplate } from 'src/application/predicate-template/commands/update-predicate-template';
import { getAllPredicateTemplates, PredicateTemplateDto } from 'src/application/predicate-template/queries/get-all-predicate-templates';
import { PredicateTemplateData } from 'src/domain/predicate-template';
import { createDiff, isEmpty } from 'src/util';
import Vue from 'vue';
import { getStoreBuilder } from 'vuex-typex';

export interface PredicateTemplateState extends PredicateTemplateDto { }

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
  const response = await getAllPredicateTemplates({});
  predicateTemplates.addAll(response);
}

export async function createAsync(_: any, data: PredicateTemplateData) {
  const response = await createPredicateTemplate(data);

  const template: PredicateTemplateState = {
    id: response.templateId,
    version: response.templateVersion,
    ...data,
  };

  predicateTemplates.addOrReplace(template);
}

export async function updateAsync(_: any, args: { templateId: string; data: PredicateTemplateData }) {
  const originalTemplate = predicateTemplates.state.templatesById[args.templateId];

  const diff = createDiff(originalTemplate, args.data);

  if (isEmpty(diff)) {
    return;
  }

  const response = await updatePredicateTemplate({
    templateId: args.templateId,
    unmodifiedTemplateVersion: originalTemplate.version,
    diff,
  });

  const template: PredicateTemplateState = {
    ...originalTemplate,
    version: response.templateVersion,
    ...args.data,
  };

  predicateTemplates.addOrReplace(template);
}

export async function deleteAsync(_: any, templateId: string) {
  await deletePredicateTemplate({
    templateId,
    unmodifiedTemplateVersion: 1,
  });

  predicateTemplates.delete(templateId);
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
