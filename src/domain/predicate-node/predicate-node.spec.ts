import { PredicateNode } from './predicate-node';

describe('Predicate', () => {
  it('should save and load', async () => {
    const predicateNode = PredicateNode.create('predicate-kind/1', {}, undefined);

    await PredicateNode.saveAsync(predicateNode);

    const loadedPredicateNode = await PredicateNode.ofIdAsync(predicateNode.id);

    expect(loadedPredicateNode.id).toEqual(predicateNode.id);
    expect(loadedPredicateNode.predicateKindId).toEqual(predicateNode.predicateKindId);
    expect(loadedPredicateNode.parameterValues).toEqual(predicateNode.parameterValues);
    expect(loadedPredicateNode.unmutatedVersion).toEqual(predicateNode.unmutatedVersion);
  });

  it('should save snapshot and load', async () => {
    const predicateNode = PredicateNode.create('predicate-kind/1', {}, undefined);

    await PredicateNode.saveSnapshotAsync(predicateNode);

    const loadedPredicateNode = await PredicateNode.ofIdAsync(predicateNode.id);

    expect(loadedPredicateNode.id).toEqual(predicateNode.id);
    expect(loadedPredicateNode.predicateKindId).toEqual(predicateNode.predicateKindId);
    expect(loadedPredicateNode.parameterValues).toEqual(predicateNode.parameterValues);
    expect(loadedPredicateNode.unmutatedVersion).toEqual(predicateNode.unmutatedVersion);
  });
});
