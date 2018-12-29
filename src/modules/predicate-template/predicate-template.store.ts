import axios from 'axios';
import { BareActionContext, getStoreBuilder } from 'vuex-typex';
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

export function createNew(state: PredicateTemplatesState, newTemplate: PredicateTemplate) {
  state.templateIds.push(newTemplate.id);
  state.templatesById[newTemplate.id] = newTemplate;
}

export async function loadAllAsync(_: BareActionContext<PredicateTemplatesState, {}>) {
  try {
    predicateTemplates.markAsLoading();
    const response = await axios.get<PredicateTemplate[]>(`/predicate-templates/ask/all`);
    predicateTemplates.setTemplates(response.data);
  } catch (e) {
    errors.setError({ message: JSON.stringify(e) });
    predicateTemplates.setTemplates([]);
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
  createNew: b.commit(createNew),

  loadAllAsync: b.dispatch(loadAllAsync),
};

export default predicateTemplates;
