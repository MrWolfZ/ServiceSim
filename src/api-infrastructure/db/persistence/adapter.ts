export interface DocumentCollectionOptions {
  documentType: string;
  keepRevisions: boolean;
}

export interface Document {
  id: string;
}

export interface PersistenceAdapter {
  initialize?: () => Promise<void>;
  getCollection<TDocument extends Document>(options: DocumentCollectionOptions): DocumentCollection<TDocument>;
  drop(): Promise<void>;
}

export interface DocumentCollection<TDocument extends Document> {
  generateId(): Promise<string>;

  upsert(document: TDocument): Promise<void>;
  delete(document: TDocument): Promise<void>;
  dropAll(): Promise<void>;

  getAll(): Promise<TDocument[]>;
  getLatestVersionById(id: string): Promise<TDocument | undefined>;
  getByIdAndVersion(id: string, version: number): Promise<TDocument | undefined>;
}
