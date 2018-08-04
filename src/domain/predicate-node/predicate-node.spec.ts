import { PredicateTemplate } from '../predicate-template';
import { PredicateNode } from './predicate-node';

describe('Predicate', () => {
  it('should save and load', async () => {
    const predicateTemplate = PredicateTemplate.create('Test', 'Description', 'return true;', []);
    const predicateNode = PredicateNode.create(predicateTemplate, {}, undefined);

    await PredicateNode.saveAsync(predicateNode);

    const loadedPredicateNode = await PredicateNode.ofIdAsync(predicateNode.id);

    expect(loadedPredicateNode.id).toEqual(predicateNode.id);
    expect(loadedPredicateNode.predicateTemplateVersionSnapshot).toEqual(predicateNode.predicateTemplateVersionSnapshot);
    expect(loadedPredicateNode.parameterValues).toEqual(predicateNode.parameterValues);
    expect(loadedPredicateNode.unmutatedVersion).toEqual(predicateNode.unmutatedVersion);
  });

  it('should save snapshot and load', async () => {
    const predicateTemplate = PredicateTemplate.create('Test', 'Description', 'return true;', []);
    const predicateNode = PredicateNode.create(predicateTemplate, {}, undefined);

    await PredicateNode.saveSnapshotAsync(predicateNode);

    const loadedPredicateNode = await PredicateNode.ofIdAsync(predicateNode.id);

    expect(loadedPredicateNode.id).toEqual(predicateNode.id);
    expect(loadedPredicateNode.predicateTemplateVersionSnapshot).toEqual(predicateNode.predicateTemplateVersionSnapshot);
    expect(loadedPredicateNode.parameterValues).toEqual(predicateNode.parameterValues);
    expect(loadedPredicateNode.unmutatedVersion).toEqual(predicateNode.unmutatedVersion);
  });
});
