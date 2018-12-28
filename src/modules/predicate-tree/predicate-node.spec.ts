import { PredicateTemplate } from '../predicate-template/predicate-template';
import { PredicateNode } from './predicate-node';

describe('Predicate', () => {
  it('should save and load', async () => {
    const predicateTemplate = PredicateTemplate.create('Test', 'Description', 'return true;', []);
    const predicateNode = PredicateNode.create(
      'Test',
      '',
      {
        template: predicateTemplate,
        parameterValues: {},
      }, undefined,
    );

    await PredicateNode.saveAsync(predicateNode);

    const loadedPredicateNode = await PredicateNode.ofIdAsync(predicateNode.id);

    expect(loadedPredicateNode.id).toEqual(predicateNode.id);
    expect(loadedPredicateNode.templateInfoOrCustomProperties).toEqual(predicateNode.templateInfoOrCustomProperties);
    expect(loadedPredicateNode.childNodeIdsOrResponseGenerator).toEqual(predicateNode.childNodeIdsOrResponseGenerator);
    expect(loadedPredicateNode.unmutatedVersion).toEqual(predicateNode.unmutatedVersion);
  });

  it('should save snapshot and load', async () => {
    const predicateTemplate = PredicateTemplate.create('Test', 'Description', 'return true;', []);
    const predicateNode = PredicateNode.create(
      'Test',
      '',
      {
        template: predicateTemplate,
        parameterValues: {},
      }, undefined,
    );

    await PredicateNode.saveSnapshotAsync(predicateNode);

    const loadedPredicateNode = await PredicateNode.ofIdAsync(predicateNode.id);

    expect(loadedPredicateNode.id).toEqual(predicateNode.id);
    expect(loadedPredicateNode.templateInfoOrCustomProperties).toEqual(predicateNode.templateInfoOrCustomProperties);
    expect(loadedPredicateNode.childNodeIdsOrResponseGenerator).toEqual(predicateNode.childNodeIdsOrResponseGenerator);
    expect(loadedPredicateNode.unmutatedVersion).toEqual(predicateNode.unmutatedVersion);
  });
});
