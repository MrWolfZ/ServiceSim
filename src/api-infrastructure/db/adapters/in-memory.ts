import { DocumentCollection, PersistenceAdapter } from './adapter';

const inMemoryDb: { [documentType: string]: { [id: string]: any[] } } = {};

// use class since object literal didn't work due to generic param being inferred as {}
class DocumentCollectionImpl<TDocument> implements DocumentCollection<TDocument> {
  constructor(private documentType: string) {
    inMemoryDb[documentType] = inMemoryDb[documentType] || {};
  }

  async generateId() {
    return `${this.documentType}/${Object.keys(inMemoryDb[this.documentType]).length + 1}`;
  }

  async set(id: string, document: TDocument) {
    inMemoryDb[this.documentType][id] = [document];
  }

  async addVersion(id: string, document: TDocument) {
    inMemoryDb[this.documentType][id] = inMemoryDb[this.documentType][id] || [];
    inMemoryDb[this.documentType][id].push(document);
  }

  async delete(id: string) {
    delete inMemoryDb[this.documentType][id];
  }

  async dropAll() {
  }

  async getAll(): Promise<TDocument[]> {
    const docs = inMemoryDb[this.documentType];
    return Object.keys(docs)
      .map(k => docs[k])
      .filter(entities => entities.length > 0)
      .map(entities => entities[entities.length - 1]);
  }

  async getLatestVersionById(id: string) {
    const docs = inMemoryDb[this.documentType];
    const docVersions = docs[id];
    return docVersions.length > 0 ? docVersions[docVersions.length - 1] : undefined;
  }

  async getByIdAndVersion(id: string, version: number) {
    const docs = inMemoryDb[this.documentType];
    const docVersions = docs[id];
    return docVersions.length > 0 ? docVersions[version] : undefined;
  }
}

export const inMemoryPersistenceAdapter: PersistenceAdapter = {
  getCollection<TDocument>(documentType: string) {
    return new DocumentCollectionImpl<TDocument>(documentType);
  },
};
