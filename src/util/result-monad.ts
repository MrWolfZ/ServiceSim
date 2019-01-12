export type Result<TSuccess = void, TFailure = void> = Success<TSuccess> | Failure<TFailure>;

export interface Success<TSuccess = void> {
  type: 'success';
  success: TSuccess;
}

export interface Failure<TFailure = void> {
  type: 'failure';
  failure: TFailure;
  stackTrace: string | undefined;
}

export function isResult<TSuccess = void, TFailure = void>(object: any): object is Result<TSuccess, TFailure> {
  return isSuccess(object) || isFailure(object);
}

export function matchResult<TResult, TSuccess = void, TFailure = void>(
  result: Result<TSuccess, TFailure>,
  onSuccess: (value: TSuccess) => TResult,
  onFailure: (value: TFailure) => TResult,
): TResult {
  return isSuccess(result) ? onSuccess(result.success) : onFailure(result.failure);
}

export function isSuccess<TSuccess>(obj: any): obj is Success<TSuccess> {
  return !!obj && (obj as Success).type === 'success' && hasProperty(obj as Success, 'success');
}

export function success(): Success;
export function success<TSuccess>(value: TSuccess): Success<TSuccess>;
export function success<TSuccess>(value?: TSuccess): Success<TSuccess> {
  return {
    type: 'success',
    success: value!,
  };
}

export function isFailure<TFailure>(obj: any): obj is Failure<TFailure> {
  return !!obj && (obj as Failure).type === 'failure' && hasProperty(obj as Failure, 'failure');
}

declare global {
  interface ErrorConstructor {
    captureStackTrace(targetObject: Object, constructorOpt?: Function): void;
  }
}

export function failure(): Failure;
export function failure<TFailure>(value: TFailure): Failure<TFailure>;
export function failure<TFailure>(value?: TFailure): Failure<TFailure> {
  const result: Failure<TFailure> = {
    type: 'failure',
    failure: value!,
    stackTrace: undefined,
  };

  if (Error.captureStackTrace) {
    const stackHolder = { stack: '' };
    Error.captureStackTrace(stackHolder, failure);
    result.stackTrace = stackHolder.stack;
  } else {
    result.stackTrace = new Error().stack;
  }

  return result;
}

export function unwrap<TSuccess>(result: TSuccess | Result<TSuccess, any>) {
  if (!isResult<TSuccess, any>(result)) {
    return result;
  }

  if (isSuccess(result)) {
    return result.success;
  }

  throw failure(`cannot unwrap a failure! payload: ${result.failure}`);
}

function hasProperty<T>(instance: T, propertyName: keyof T) {
  return Object.prototype.hasOwnProperty.call(instance, propertyName as keyof Success);
}
