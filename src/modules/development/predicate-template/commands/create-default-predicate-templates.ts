import { keys } from '../../../../util';
import * as DEFAULT_TEMPLATES from '../default-templates';
import { createPredicateTemplate } from './create-predicate-template';

export async function createDefaultPredicateTemplates() {
  for (const key of keys(DEFAULT_TEMPLATES)) {
    await createPredicateTemplate(DEFAULT_TEMPLATES[key]);
  }
}
