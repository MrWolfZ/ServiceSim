import * as ej from '../../infrastructure/event-journal';
import { toBatch, toEvents } from '../../infrastructure/event-source-repository';
import * as es from '../../infrastructure/event-stream';
import { apply, createFromEvents, DomainEvents, RequestMatcher } from './request-matcher';

const journal = ej.open('repo-request-matcher');

export function requestMatcherOfId(
  id: string,
): RequestMatcher {
  const stream = ej.readStream(journal, id);
  const events = toEvents<DomainEvents>(stream.stream);

  if (es.hasSnapshot(stream)) {
    const matcher = JSON.parse(stream.snapshot) as RequestMatcher;
    return events.reduce(apply, matcher);
  } else {
    return createFromEvents(
      events,
      stream.streamVersion,
    );
  }
}

export function save(
  requestMatcher: RequestMatcher,
  shouldCreateSnapshot = false,
) {
  const snapshotValue: RequestMatcher | undefined = shouldCreateSnapshot ? {
    ...requestMatcher,
    mutatingEvents: [],
    unmutatedVersion: requestMatcher.mutatedVersion,
    mutatedVersion: requestMatcher.mutatedVersion + 1,
  } : undefined;

  ej.write(
    journal,
    requestMatcher.id,
    requestMatcher.mutatedVersion,
    toBatch(requestMatcher.mutatingEvents, snapshotValue),
  );
}
