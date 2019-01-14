export interface PersistenceAdapter {
  initialize?: () => Promise<void>;
  getCollection<TDocument>(documentType: string): DocumentCollection<TDocument>;
  drop(): Promise<void>;
}

export interface DocumentCollection<TDocument> {
  generateId(): Promise<string>;

  set(id: string, document: TDocument): Promise<void>;
  addVersion(id: string, document: TDocument): Promise<void>;
  delete(id: string): Promise<void>;
  dropAll(): Promise<void>;

  getAll(): Promise<TDocument[]>;
  getLatestVersionById(id: string): Promise<TDocument | undefined>;
  getByIdAndVersion(id: string, version: number): Promise<TDocument | undefined>;
}
