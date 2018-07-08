import { requestMatcherOfId, save } from './repository';
import { create } from './request-matcher';

describe('request matcher repository', () => {
  it('should save and load', () => {
    const matcher = create(
      'matchers/1',
      'path-pattern',
      {
        pattern: '',
      },
    );

    save(matcher);

    const loadedMatcher = requestMatcherOfId(matcher.id);

    expect(loadedMatcher.id).toEqual(matcher.id);
    expect(loadedMatcher.matcherKind).toEqual(matcher.matcherKind);
    expect(loadedMatcher.properties).toEqual(matcher.properties);
    expect(loadedMatcher.unmutatedVersion).toEqual(matcher.mutatedVersion);
  });

  it('should save snapshot and load', () => {
    const matcher = create(
      'matchers/1',
      'path-pattern',
      {
        pattern: '',
      },
    );

    save(matcher, true);

    const loadedMatcher = requestMatcherOfId(matcher.id);

    expect(loadedMatcher.id).toEqual(matcher.id);
    expect(loadedMatcher.matcherKind).toEqual(matcher.matcherKind);
    expect(loadedMatcher.properties).toEqual(matcher.properties);
    expect(loadedMatcher.unmutatedVersion).toEqual(matcher.mutatedVersion);
  });
});
