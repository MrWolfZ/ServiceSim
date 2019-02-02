import fs from 'fs';
import path from 'path';
import { Document, DocumentCollection, DocumentCollectionOptions, PersistenceAdapter } from 'src/infrastructure/db/persistence';
import { failure } from 'src/util';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const unlink = promisify(fs.unlink);
const rmdir = promisify(fs.rmdir);
const stat = promisify(fs.stat);
const lstat = promisify(fs.lstat);

// some of these methods have race conditions when reading, but that is okay since we expect eventual consistency
function createDocumentCollection<TDocument extends Document>(options: DocumentCollectionOptions, dataDirPath: string): DocumentCollection<TDocument> {
  const { documentType, keepRevisions } = options;

  const collectionDirPath = path.join(dataDirPath, documentType);

  const fileNameForVersion = (version: number) => `${version.toString().padStart(15, '0')}.json`;
  const stripIdPrefix = (id: string) => id.substring(id.lastIndexOf(`/`) + 1);
  const createDocumentDirPath = (id: string) => path.join(collectionDirPath, stripIdPrefix(id));
  const createDocumentPath = (id: string, version = 1) => path.join(createDocumentDirPath(id), fileNameForVersion(version));

  const readDocument = async (docPath: string) => {
    const fileContent = await readFile(docPath);
    return JSON.parse(fileContent.toString()) as TDocument;
  };

  const getLatestVersionById = async (docDirPath: string) => {
    if (!(await pathExists(docDirPath))) {
      throw failure(`could not find path ${docDirPath}!`);
    }

    const paths = await readdir(docDirPath);

    if (paths.length === 0) {
      throw failure(`could not find any file for document in path ${docDirPath}!`);
    }

    return await readDocument(path.join(docDirPath, fileNameForVersion(paths.length)));
  };

  async function addVersion(document: TDocument) {
    const documentDirPath = createDocumentDirPath(document.id);
    await ensureDirectoryExists(documentDirPath);
    const files = await readdir(documentDirPath);
    const newVersion = files.length + 1;
    await writeFile(createDocumentPath(document.id, newVersion), JSON.stringify(document, undefined, 2));
  }

  return {
    async generateId() {
      let id = 1;

      if (await pathExists(collectionDirPath)) {
        const paths = await readdir(collectionDirPath);
        id = paths.length + 1;
      }

      return `${documentType}-${id}`;
    },

    async upsert(document: TDocument) {
      if (keepRevisions) {
        await addVersion(document);
      } else {
        await ensureDirectoryExists(createDocumentDirPath(document.id));
        await writeFile(createDocumentPath(document.id), JSON.stringify(document, undefined, 2));
      }
    },

    async delete(document: TDocument) {
      if (keepRevisions) {
        await addVersion(document);
      } else {
        await deleteDir(createDocumentDirPath(document.id));
      }
    },

    async dropAll() {
      await deleteDir(collectionDirPath);
    },

    async getAll(): Promise<TDocument[]> {
      if (!await pathExists(collectionDirPath)) {
        return [];
      }

      const dirs = await readdir(collectionDirPath);
      return await Promise.all(dirs.map(dir => path.join(collectionDirPath, dir)).map(getLatestVersionById));
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
    getCollection<TDocument extends Document>(options: DocumentCollectionOptions) {
      return createDocumentCollection<TDocument>(options, dataDirPath);
    },

    async drop() {
      await deleteDir(dataDirPath);
    },
  };
}

async function ensureDirectoryExists(dirPath: string) {
  if (await pathExists(dirPath)) {
    return;
  }

  await ensureDirectoryExists(path.dirname(dirPath));
  await mkdir(dirPath);
}

async function deleteDir(dirPath: string) {
  if (!dirPath || dirPath === '/') {
    throw failure(`cannot delete dir ${dirPath}`);
  }

  if (!await pathExists(dirPath)) {
    return;
  }

  const names = await readdir(dirPath);

  for (const name of names) {
    const curPath = path.join(dirPath, name);
    const stat = await lstat(curPath);

    if (stat.isDirectory()) {
      await deleteDir(curPath);
    } else {
      await unlink(curPath);
    }
  }

  await rmdir(dirPath);
}

async function pathExists(path: string) {
  try {
    await stat(path);
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
