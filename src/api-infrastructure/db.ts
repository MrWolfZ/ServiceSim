import { DocumentStore, IDocumentSession } from 'ravendb';
import { RavenDbDocument } from './api-infrastructure.types';

let store: DocumentStore | undefined;

export const db = {
  async initializeAsync() {
    store = new DocumentStore(process.env.RAVEN_ADDRESS!, 'ServiceSim');
    store.conventions.findCollectionNameForObjectLiteral = entity => (entity as RavenDbDocument).$collection;
    store.initialize();
  },

  get store() {
    if (!store) {
      throw new Error('store must be initialized before it can be used');
    }

    return store;
  },

  async withSession<T = void>(fn: (session: IDocumentSession) => T | Promise<T>) {
    const session = db.store.openSession();
    const result = await fn(session);
    session.dispose();
    return result;
  },
};
