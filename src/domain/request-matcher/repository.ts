import * as ej from '../../infrastructure/event-journal';
import { toBatch, toEvents } from '../../infrastructure/event-source-repository';
import * as es from '../../infrastructure/event-stream';
import { apply, createFromEvents, DomainEvents, RequestMatcher } from './request-matcher';

let journal: ej.EventJournal | undefined;

async function ensureJournalAsync(): Promise<ej.EventJournal> {
  if (!journal) {
    journal = await ej.openAsync('repo-request-matcher');
  }

  return journal;
}

export async function requestMatcherOfIdAsync(
  id: string,
): Promise<RequestMatcher> {
  const stream = await ej.readStreamAsync(await ensureJournalAsync(), id);
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

export async function saveAsync(
  requestMatcher: RequestMatcher,
  shouldCreateSnapshot = false,
) {
  const snapshotValue: RequestMatcher | undefined = shouldCreateSnapshot ? {
    ...requestMatcher,
    mutatingEvents: [],
    unmutatedVersion: requestMatcher.mutatedVersion,
    mutatedVersion: requestMatcher.mutatedVersion + 1,
  } : undefined;

  await ej.writeAsync(
    await ensureJournalAsync(),
    requestMatcher.id,
    requestMatcher.mutatedVersion,
    toBatch(requestMatcher.mutatingEvents, snapshotValue),
  );
}
