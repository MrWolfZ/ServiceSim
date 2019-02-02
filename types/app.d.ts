declare type NonFunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? never : K }[keyof T];
declare type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;
declare type NonUndefined<T> = Exclude<T, undefined>;
declare type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
declare type Exact<A, B = {}> = A & Record<keyof Omit<B, keyof A>, never>;
