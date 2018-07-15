import { ResponseGenerator } from './response-generator';

describe('ResponseGenerator', () => {
  it('should save and load', async () => {
    const responseGenerator = ResponseGenerator.create('response-generator-kind/1');

    await ResponseGenerator.saveAsync(responseGenerator);

    const loadedResponseGenerator = await ResponseGenerator.ofIdAsync(responseGenerator.id);

    expect(loadedResponseGenerator.id).toEqual(responseGenerator.id);
    expect(loadedResponseGenerator.responseGeneratorKindId).toEqual(responseGenerator.responseGeneratorKindId);
    expect(loadedResponseGenerator.properties).toEqual(responseGenerator.properties);
    expect(loadedResponseGenerator.unmutatedVersion).toEqual(responseGenerator.unmutatedVersion);
  });

  it('should save snapshot and load', async () => {
    const responseGenerator = ResponseGenerator.create('response-generator-kind/1');

    await ResponseGenerator.saveSnapshotAsync(responseGenerator);

    const loadedResponseGenerator = await ResponseGenerator.ofIdAsync(responseGenerator.id);

    expect(loadedResponseGenerator.id).toEqual(responseGenerator.id);
    expect(loadedResponseGenerator.responseGeneratorKindId).toEqual(responseGenerator.responseGeneratorKindId);
    expect(loadedResponseGenerator.properties).toEqual(responseGenerator.properties);
    expect(loadedResponseGenerator.unmutatedVersion).toEqual(responseGenerator.unmutatedVersion);
  });
});
