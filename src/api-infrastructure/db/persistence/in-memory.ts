import { DocumentCollection, PersistenceAdapter } from './adapter';

let inMemoryDb: { [documentType: string]: { [id: string]: any[] } } = {};

function createDocumentCollection<TDocument>(documentType: string): DocumentCollection<TDocument> {
  inMemoryDb[documentType] = inMemoryDb[documentType] || {};

  return {
    async generateId() {
      return `${documentType}/${Object.keys(inMemoryDb[documentType]).length + 1}`;
    },

    async set(id: string, document: TDocument) {
      inMemoryDb[documentType][id] = [document];
    },

    async addVersion(id: string, document: TDocument) {
      inMemoryDb[documentType][id] = inMemoryDb[documentType][id] || [];
      inMemoryDb[documentType][id].push(document);
    },

    async delete(id: string) {
      delete inMemoryDb[documentType][id];
    },

    async dropAll() {
      inMemoryDb[documentType] = {};
    },

    async getAll(): Promise<TDocument[]> {
      const docs = inMemoryDb[documentType];
      return Object.keys(docs)
        .map(k => docs[k])
        .filter(entities => entities.length > 0)
        .map(entities => entities[entities.length - 1]);
    },

    async getLatestVersionById(id: string) {
      const docs = inMemoryDb[documentType];
      const docVersions = docs[id];
      return docVersions.length > 0 ? docVersions[docVersions.length - 1] : undefined;
    },

    async getByIdAndVersion(id: string, version: number) {
      const docs = inMemoryDb[documentType];
      const docVersions = docs[id];
      return docVersions.length > 0 ? docVersions[version - 1] : undefined;
    },
  };
}

export const inMemoryPersistenceAdapter: PersistenceAdapter = {
  getCollection<TDocument>(documentType: string) {
    return createDocumentCollection<TDocument>(documentType);
  },

  async drop() {
    inMemoryDb = {};
  },
};
