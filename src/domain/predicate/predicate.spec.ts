import { create, ofIdAsync, saveAsync, saveSnapshotAsync } from './predicate';

describe('Predicate', () => {
  it('should save and load', async () => {
    const predicate = create('predicate-kind/1');

    await saveAsync(predicate);

    const loadedPredicate = await ofIdAsync(predicate.id);

    expect(loadedPredicate.id).toEqual(predicate.id);
    expect(loadedPredicate.predicateKindId).toEqual(predicate.predicateKindId);
    expect(loadedPredicate.properties).toEqual(predicate.properties);
    expect(loadedPredicate.unmutatedVersion).toEqual(predicate.mutatedVersion);
  });

  it('should save snapshot and load', async () => {
    const predicate = create('predicate-kind/1');

    await saveSnapshotAsync(predicate);

    const loadedPredicate = await ofIdAsync(predicate.id);

    expect(loadedPredicate.id).toEqual(predicate.id);
    expect(loadedPredicate.predicateKindId).toEqual(predicate.predicateKindId);
    expect(loadedPredicate.properties).toEqual(predicate.properties);
    expect(loadedPredicate.unmutatedVersion).toEqual(predicate.mutatedVersion);
  });
});
