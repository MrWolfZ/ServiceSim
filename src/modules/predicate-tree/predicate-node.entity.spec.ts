import { PredicateTemplate } from '../predicate-template/predicate-template.entity';
import { PredicateNode } from './predicate-node.entity';

describe('Predicate', () => {
  it('should save and load', async () => {
    const predicateTemplate = PredicateTemplate.create({
      name: 'Test',
      description: 'test description',
      evalFunctionBody: 'return true;',
      parameters: [],
    });
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
    const predicateTemplate = PredicateTemplate.create({
      name: 'Test',
      description: 'test description',
      evalFunctionBody: 'return true;',
      parameters: [],
    });
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
