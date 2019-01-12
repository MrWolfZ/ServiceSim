import { deepEquals } from './deep-equals';
import { keys } from './util';

export type Diff<T> =
  T extends (infer U)[] ? ArrayDiffOp<U>[]
  : T extends object ? ObjectDiff<T>
  : T;

export type ObjectDiff<T> = {
  [prop in keyof T]?: Diff<T[prop]>;
};

export type ArrayDiffOp<T> =
  | InsertArrayElementOp<T>
  | UpdateArrayElementOp<T>
  | RemoveArrayElementOp
  ;

export interface InsertArrayElementOp<T> {
  index: number;
  value: T;
}

export interface UpdateArrayElementOp<T> {
  index: number;
  diff: Diff<T>;
}

export interface RemoveArrayElementOp {
  index: number;
}

export function createDiff<T>(origValue: T, updatedValue: T): Diff<T> {
  if (origValue === null || ['string', 'number', 'boolean', 'undefined'].indexOf(typeof origValue) >= 0) {
    return updatedValue as Diff<T>;
  }

  if (Array.isArray(origValue) && Array.isArray(updatedValue)) {
    return createArrayDiff(origValue, updatedValue) as Diff<T>;
  }

  return createObjectDiff(origValue, updatedValue);
}

export function createArrayDiff<T>(origArr: T[], updatedArr: T[]): Diff<T[]> {
  const removals: RemoveArrayElementOp[] = [];

  for (const [index, el] of origArr.entries()) {
    if (updatedArr.every(updatedEl => !deepEquals(el, updatedEl))) {
      removals.push({ index });
    }
  }

  const inserts: InsertArrayElementOp<T>[] = [];
  const updates: UpdateArrayElementOp<T>[] = [];

  for (const [index, el] of updatedArr.entries()) {
    if (origArr.every(origEl => !deepEquals(el, origEl))) {
      const removalOpIdx = removals.findIndex(op => op.index === index);
      if (removalOpIdx !== -1) {
        updates.push({ index, diff: createDiff(origArr[index], el) });
        removals.splice(removalOpIdx, 1);
      } else {
        inserts.push({ index, value: el });
      }
    }
  }

  return removals.concat(inserts).concat(updates);
}

export function createObjectDiff<T>(origObj: T, updatedObj: T): Diff<T> {
  return keys(updatedObj).reduce((agg, key) => {
    if (deepEquals(origObj[key], updatedObj[key])) {
      return agg;
    }

    return {
      ...agg,
      [key]: createDiff(origObj[key], updatedObj[key]),
    } as ObjectDiff<T>;
  }, {} as ObjectDiff<T>) as Diff<T>;
}
