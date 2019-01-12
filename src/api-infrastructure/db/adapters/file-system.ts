import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { failure } from '../../../util';
import { DocumentCollection, PersistenceAdapter } from './adapter';

// some of these methods have race conditions when reading, but that is okay since we expect eventual consistency
function createDocumentCollection<TDocument>(documentType: string, dataDirPath: string): DocumentCollection<TDocument> {
  const collectionDirPath = path.join(dataDirPath, documentType);

  const normalizeId = (id: string) => id;
  const createDocumentDirPath = (id: string) => path.join(collectionDirPath, normalizeId(id));
  const createDocumentPath = (id: string, version = 1) => path.join(createDocumentDirPath(id), version.toString());

  const readDocument = async (docPath: string) => {
    const fileContent = await promisify(fs.readFile)(docPath);
    return JSON.parse(fileContent.toString()) as TDocument;
  };

  const getLatestVersionById = async (docDirPath: string) => {
    if (!(await pathExists(docDirPath))) {
      throw failure(`could not find path ${docDirPath}!`);
    }

    const paths = await promisify(fs.readdir)(docDirPath);

    if (paths.length === 0) {
      throw failure(`could not find any file for document in path ${docDirPath}!`);
    }

    return await readDocument(path.join(docDirPath, paths.length.toString()));
  };

  return {
    async generateId() {
      const paths = await promisify(fs.readdir)(collectionDirPath);
      return `${documentType}/${paths.length + 1}`;
    },

    async set(id: string, document: TDocument) {
      await ensureDirectoryExists(createDocumentDirPath(id));
      await promisify(fs.writeFile)(createDocumentPath(id), JSON.stringify(document));
    },

    async addVersion(id: string, document: TDocument) {
      const documentDirPath = createDocumentDirPath(id);
      await ensureDirectoryExists(documentDirPath);
      const files = await promisify(fs.readdir)(documentDirPath);
      const newVersion = files.length + 1;
      await promisify(fs.writeFile)(createDocumentPath(id, newVersion), JSON.stringify(document));
    },

    async delete(id: string) {
      await promisify(fs.unlink)(createDocumentDirPath(id));
    },

    async dropAll() {
      await promisify(fs.unlink)(collectionDirPath);
    },

    async getAll(): Promise<TDocument[]> {
      if (!(await pathExists(collectionDirPath))) {
        return [];
      }

      const dirs = await promisify(fs.readdir)(collectionDirPath);
      return await Promise.all(dirs.map(getLatestVersionById));
    },

    async getLatestVersionById(id: string) {
      return await getLatestVersionById(createDocumentDirPath(id));
    },

    async getByIdAndVersion(id: string, version: number) {
      const docPath = createDocumentPath(id, version);

      if (!(await pathExists(docPath))) {
        throw failure(`could not find file for document ${id} in version ${version}!`);
      }

      return await readDocument(docPath);
    },
  };
}

export function createFileSystemPersistenceAdapter(dataDirPath: string): PersistenceAdapter {
  return {
    getCollection<TDocument>(documentType: string) {
      return createDocumentCollection<TDocument>(documentType, dataDirPath);
    },
  };
}

async function ensureDirectoryExists(filePath: string) {
  const dirname = path.dirname(filePath);

  if (await pathExists(dirname)) {
    return true;
  }

  ensureDirectoryExists(dirname);
  await promisify(fs.mkdir)(dirname);
}

async function pathExists(path: string) {
  try {
    await promisify(fs.stat)(path);
    return true;
  } catch (err) {
    if (isErrorNotFound(err)) {
      return false;
    }

    throw err;
  }
}

function isErrorNotFound(err: any) {
  return err.code === 'ENOENT';
}
