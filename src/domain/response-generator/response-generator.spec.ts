import { create, ofIdAsync, saveAsync, saveSnapshotAsync } from './response-generator';

describe('ResponseGenerator', () => {
  it('should save and load', async () => {
    const responseGenerator = create('response-generator-kind/1');

    await saveAsync(responseGenerator);

    const loadedResponseGenerator = await ofIdAsync(responseGenerator.id);

    expect(loadedResponseGenerator.id).toEqual(responseGenerator.id);
    expect(loadedResponseGenerator.responseGeneratorKindId).toEqual(responseGenerator.responseGeneratorKindId);
    expect(loadedResponseGenerator.properties).toEqual(responseGenerator.properties);
    expect(loadedResponseGenerator.unmutatedVersion).toEqual(responseGenerator.mutatedVersion);
  });

  it('should save snapshot and load', async () => {
    const responseGenerator = create('response-generator-kind/1');

    await saveSnapshotAsync(responseGenerator);

    const loadedResponseGenerator = await ofIdAsync(responseGenerator.id);

    expect(loadedResponseGenerator.id).toEqual(responseGenerator.id);
    expect(loadedResponseGenerator.responseGeneratorKindId).toEqual(responseGenerator.responseGeneratorKindId);
    expect(loadedResponseGenerator.properties).toEqual(responseGenerator.properties);
    expect(loadedResponseGenerator.unmutatedVersion).toEqual(responseGenerator.mutatedVersion);
  });
});
