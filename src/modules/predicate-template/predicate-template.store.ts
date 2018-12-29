import axios from 'axios';
import { getStoreBuilder } from 'vuex-typex';
import errors from '../errors/errors.store';
import { Parameter } from '../parameter/parameter';

// class instead of interface to prevent webpack warnings
export class PredicateTemplate {
  id: string;
  name: string;
  description: string;
  parameters: Parameter[];
  evalFunctionBody: string;
}

export interface PredicateTemplateMap { [templateId: string]: PredicateTemplate; }
export interface PredicateTemplatesState {
  templateIds: string[];
  templatesById: PredicateTemplateMap;
  dataIsLoading: boolean;
  dataWasLoaded: boolean;
}

const b = getStoreBuilder<{}>().module<PredicateTemplatesState>('predicateTemplates', {
  templateIds: [],
  templatesById: {},
  dataIsLoading: false,
  dataWasLoaded: false,
});

export function all(state: PredicateTemplatesState) {
  return state.templateIds.map(id => state.templatesById[id]);
}

export function markAsLoading(state: PredicateTemplatesState) {
  state.dataIsLoading = true;
}

export function setTemplates(state: PredicateTemplatesState, templates: PredicateTemplate[]) {
  state.templateIds = templates.map(t => t.id);
  state.templatesById = templates.reduce((agg, template) => ({ ...agg, [template.id]: template }), {} as PredicateTemplateMap);
  state.dataIsLoading = false;
  state.dataWasLoaded = true;
}

export function create(state: PredicateTemplatesState, newTemplate: PredicateTemplate) {
  state.templateIds.push(newTemplate.id);
  state.templatesById[newTemplate.id] = newTemplate;
}

export function update(state: PredicateTemplatesState, template: PredicateTemplate) {
  state.templatesById[template.id] = template;
}

export function deleteTemplate(state: PredicateTemplatesState, templateId: string) {
  state.templateIds.splice(state.templateIds.indexOf(templateId), 1);
  delete state.templatesById[templateId];
}

export async function loadAllAsync() {
  try {
    predicateTemplates.markAsLoading();
    const response = await axios.get<PredicateTemplate[]>(`/predicate-templates`);
    predicateTemplates.setTemplates(response.data);
  } catch (e) {
    errors.setError({ message: JSON.stringify(e) });
    predicateTemplates.setTemplates([]);
    throw e;
  }
}

export async function createAsync(_: any, newTemplate: PredicateTemplate) {
  try {
    predicateTemplates.create(newTemplate);
    await axios.post(`/predicate-templates`, newTemplate);
  } catch (e) {
    errors.setError({ message: JSON.stringify(e) });
    throw e;
  }
}

export async function updateAsync(_: any, template: PredicateTemplate) {
  try {
    predicateTemplates.update(template);
    await axios.put(`/predicate-templates/${template.id}`, template);
  } catch (e) {
    errors.setError({ message: JSON.stringify(e) });
    throw e;
  }
}

export async function deleteAsync(_: any, templateId: string) {
  try {
    predicateTemplates.delete(templateId);
    await axios.delete(`/predicate-templates/${templateId}`);
  } catch (e) {
    errors.setError({ message: JSON.stringify(e) });
    throw e;
  }
}

const stateGetter = b.state();
const allGetter = b.read(all);
const predicateTemplates = {
  get state() { return stateGetter(); },
  get all() { return allGetter(); },

  markAsLoading: b.commit(markAsLoading),
  setTemplates: b.commit(setTemplates),
  create: b.commit(create),
  update: b.commit(update),
  delete: b.commit(deleteTemplate),

  loadAllAsync: b.dispatch(loadAllAsync),
  createAsync: b.dispatch(createAsync),
  updateAsync: b.dispatch(updateAsync),
  deleteAsync: b.dispatch(deleteAsync),
};

export default predicateTemplates;
