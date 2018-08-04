import { Predicate } from './predicate';

describe('Predicate', () => {
  it('should save and load', async () => {
    const predicate = Predicate.create('predicate-kind/1', {}, undefined);

    await Predicate.saveAsync(predicate);

    const loadedPredicate = await Predicate.ofIdAsync(predicate.id);

    expect(loadedPredicate.id).toEqual(predicate.id);
    expect(loadedPredicate.predicateKindId).toEqual(predicate.predicateKindId);
    expect(loadedPredicate.parameterValues).toEqual(predicate.parameterValues);
    expect(loadedPredicate.unmutatedVersion).toEqual(predicate.unmutatedVersion);
  });

  it('should save snapshot and load', async () => {
    const predicate = Predicate.create('predicate-kind/1', {}, undefined);

    await Predicate.saveSnapshotAsync(predicate);

    const loadedPredicate = await Predicate.ofIdAsync(predicate.id);

    expect(loadedPredicate.id).toEqual(predicate.id);
    expect(loadedPredicate.predicateKindId).toEqual(predicate.predicateKindId);
    expect(loadedPredicate.parameterValues).toEqual(predicate.parameterValues);
    expect(loadedPredicate.unmutatedVersion).toEqual(predicate.unmutatedVersion);
  });
});
