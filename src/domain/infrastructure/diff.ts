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
