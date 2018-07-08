import { requestMatcherOfIdAsync, saveAsync } from './repository';
import { create } from './request-matcher';

describe('request matcher repository', () => {
  it('should save and load', async () => {
    const matcher = create(
      'matchers/1',
      'path-pattern',
      {
        pattern: '',
      },
    );

    await saveAsync(matcher);

    const loadedMatcher = await requestMatcherOfIdAsync(matcher.id);

    expect(loadedMatcher.id).toEqual(matcher.id);
    expect(loadedMatcher.matcherKind).toEqual(matcher.matcherKind);
    expect(loadedMatcher.properties).toEqual(matcher.properties);
    expect(loadedMatcher.unmutatedVersion).toEqual(matcher.mutatedVersion);
  });

  it('should save snapshot and load', async () => {
    const matcher = create(
      'matchers/1',
      'path-pattern',
      {
        pattern: '',
      },
    );

    await saveAsync(matcher, true);

    const loadedMatcher = await requestMatcherOfIdAsync(matcher.id);

    expect(loadedMatcher.id).toEqual(matcher.id);
    expect(loadedMatcher.matcherKind).toEqual(matcher.matcherKind);
    expect(loadedMatcher.properties).toEqual(matcher.properties);
    expect(loadedMatcher.unmutatedVersion).toEqual(matcher.mutatedVersion);
  });
});
