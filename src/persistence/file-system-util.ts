import fs from 'fs';
import path from 'path';
import { failure } from 'src/util';
import { promisify } from 'util';

const readdir = promisify(fs.readdir);
const mkdir = promisify(fs.mkdir);
const unlink = promisify(fs.unlink);
const rmdir = promisify(fs.rmdir);
const stat = promisify(fs.stat);
const lstat = promisify(fs.lstat);

export async function ensureDirectoryExists(dirPath: string) {
  if (await pathExists(dirPath)) {
    return;
  }

  await ensureDirectoryExists(path.dirname(dirPath));
  await mkdir(dirPath);
}

export async function deleteDir(dirPath: string) {
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

export async function deleteFile(filePath: string) {
  if (!filePath || filePath === '/') {
    throw failure(`cannot delete dir ${filePath}`);
  }

  if (!await pathExists(filePath)) {
    return;
  }

  await unlink(filePath);
}

export async function pathExists(path: string) {
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

export function isErrorNotFound(err: any) {
  return err.code === 'ENOENT';
}
