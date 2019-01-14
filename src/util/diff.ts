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
  type: 'insert';
  index: number;
  value: T;
}

export interface UpdateArrayElementOp<T> {
  type: 'update';
  index: number;
  diff: Diff<T>;
}

export interface RemoveArrayElementOp {
  type: 'removal';
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

function createArrayDiff<T>(origArr: T[], updatedArr: T[]): ArrayDiffOp<T>[] {
  const removals: RemoveArrayElementOp[] = [];

  for (const [index, el] of origArr.entries()) {
    if (updatedArr.every(updatedEl => !deepEquals(el, updatedEl))) {
      removals.push({ type: 'removal', index });
    }
  }

  const inserts: InsertArrayElementOp<T>[] = [];
  const updates: UpdateArrayElementOp<T>[] = [];

  for (const [index, el] of updatedArr.entries()) {
    if (origArr.every(origEl => !deepEquals(el, origEl))) {
      const removalOpIdx = removals.findIndex(op => op.index === index);
      if (removalOpIdx !== -1) {
        updates.push({ type: 'update', index, diff: createDiff(origArr[index], el) });
        removals.splice(removalOpIdx, 1);
      } else {
        inserts.push({ type: 'insert', index, value: el });
      }
    }
  }

  return (updates as ArrayDiffOp<T>[]).concat(removals).concat(inserts);
}

function createObjectDiff<T>(origObj: T, updatedObj: T): Diff<T> {
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

export function applyDiff<T>(targetValue: T, diff: Diff<T>): T {
  if (targetValue === null || ['string', 'number', 'boolean', 'undefined'].indexOf(typeof targetValue) >= 0) {
    return diff as T;
  }

  if (Array.isArray(targetValue)) {
    return applyArrayDiff(targetValue, diff as ArrayDiffOp<any>[]) as any as T;
  }

  return applyObjectDiff(targetValue, diff as ObjectDiff<T>);
}

function applyArrayDiff<T>(targetArr: T[], ops: ArrayDiffOp<any>[]): T[] {
  const isUpdateOp = <T>(op: ArrayDiffOp<T>): op is UpdateArrayElementOp<T> => op.type === 'update';
  const isInsertOp = <T>(op: ArrayDiffOp<T>): op is InsertArrayElementOp<T> => op.type === 'insert';
  const isRemovalOp = <T>(op: ArrayDiffOp<T>): op is RemoveArrayElementOp => op.type === 'removal';

  const updates: UpdateArrayElementOp<T>[] = ops.filter(isUpdateOp);
  const removals: RemoveArrayElementOp[] = ops.filter(isRemovalOp);
  const inserts: InsertArrayElementOp<T>[] = ops.filter(isInsertOp);

  const result = [...targetArr];

  for (const updateOp of updates) {
    result[updateOp.index] = applyDiff(result[updateOp.index], updateOp.diff);
  }

  for (const removalOp of removals) {
    result.splice(removalOp.index, 1);
  }

  for (const insertOp of inserts) {
    result.splice(insertOp.index, 0, insertOp.value);
  }

  return result;
}

function applyObjectDiff<T>(targetObj: T, diff: ObjectDiff<T>): T {
  return keys(targetObj)
    .filter(key => Object.prototype.hasOwnProperty.call(diff, key))
    .reduce((agg, key) => {
      return {
        ...agg,
        [key]: applyDiff(targetObj[key], diff[key] as Diff<T[keyof T]>),
      };
    }, targetObj);
}
