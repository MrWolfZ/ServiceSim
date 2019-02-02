import { Document, DocumentCollection, DocumentCollectionOptions, PersistenceAdapter } from 'src/infrastructure/db/persistence';

let inMemoryDb: { [documentType: string]: { [id: string]: any[] } } = {};

function createDocumentCollection<TDocument extends Document>(options: DocumentCollectionOptions): DocumentCollection<TDocument> {
  const { documentType, keepRevisions } = options;

  inMemoryDb[documentType] = inMemoryDb[documentType] || {};

  return {
    async generateId() {
      return `${documentType}-${Object.keys(inMemoryDb[documentType]).length + 1}`;
    },

    async upsert(document: TDocument) {
      if (keepRevisions) {
        inMemoryDb[documentType][document.id] = inMemoryDb[documentType][document.id] || [];
        inMemoryDb[documentType][document.id].push(document);
      } else {
        inMemoryDb[documentType][document.id] = [document];
      }
    },

    async delete(document: TDocument) {
      if (keepRevisions) {
        inMemoryDb[documentType][document.id] = inMemoryDb[documentType][document.id] || [];
        inMemoryDb[documentType][document.id].push(document);
      } else {
        delete inMemoryDb[documentType][document.id];
      }
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
  getCollection<TDocument extends Document>(options: DocumentCollectionOptions) {
    return createDocumentCollection<TDocument>(options);
  },

  async drop() {
    inMemoryDb = {};
  },
};
