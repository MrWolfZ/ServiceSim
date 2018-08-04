import { PredicateKind } from '../predicate-kind';
import { PredicateNode } from './predicate-node';

describe('Predicate', () => {
  it('should save and load', async () => {
    const predicateKind = PredicateKind.create('Test', 'Description', 'return true;', []);
    const predicateNode = PredicateNode.create(predicateKind, {}, undefined);

    await PredicateNode.saveAsync(predicateNode);

    const loadedPredicateNode = await PredicateNode.ofIdAsync(predicateNode.id);

    expect(loadedPredicateNode.id).toEqual(predicateNode.id);
    expect(loadedPredicateNode.predicateKindVersionSnapshot).toEqual(predicateNode.predicateKindVersionSnapshot);
    expect(loadedPredicateNode.parameterValues).toEqual(predicateNode.parameterValues);
    expect(loadedPredicateNode.unmutatedVersion).toEqual(predicateNode.unmutatedVersion);
  });

  it('should save snapshot and load', async () => {
    const predicateKind = PredicateKind.create('Test', 'Description', 'return true;', []);
    const predicateNode = PredicateNode.create(predicateKind, {}, undefined);

    await PredicateNode.saveSnapshotAsync(predicateNode);

    const loadedPredicateNode = await PredicateNode.ofIdAsync(predicateNode.id);

    expect(loadedPredicateNode.id).toEqual(predicateNode.id);
    expect(loadedPredicateNode.predicateKindVersionSnapshot).toEqual(predicateNode.predicateKindVersionSnapshot);
    expect(loadedPredicateNode.parameterValues).toEqual(predicateNode.parameterValues);
    expect(loadedPredicateNode.unmutatedVersion).toEqual(predicateNode.unmutatedVersion);
  });
});
