export type Result<TSuccess = never, TFailure = never> = Success<TSuccess> | Failure<TFailure>;

export interface Success<TSuccess = never> {
  type: 'success';
  success: TSuccess;
}

export interface Failure<TFailure = never> {
  type: 'failure';
  failure: TFailure;
}

export function isResult<TSuccess = never, TFailure = never>(object: any): object is Result<TSuccess, TFailure> {
  return isSuccess(object) || isFailure(object);
}

export function matchResult<TResult, TSuccess = never, TFailure = never>(
  result: Result<TSuccess, TFailure>,
  onSuccess: (value: TSuccess) => TResult,
  onFailure: (value: TFailure) => TResult,
): TResult {
  return isSuccess(result) ? onSuccess(result.success) : onFailure(result.failure);
}

export function isSuccess<TSuccess>(result: Result<TSuccess, any>): result is Success<TSuccess> {
  return result.type === 'success' && hasProperty(result, 'success');
}

export function success(): Success;
export function success<TSuccess>(value: TSuccess): Success<TSuccess>;
export function success<TSuccess>(value?: TSuccess): Success<TSuccess> {
  return {
    type: 'success',
    success: value!,
  };
}

export function isFailure<TFailure>(result: Result<any, TFailure>): result is Failure<TFailure> {
  return result.type === 'failure' && hasProperty(result, 'failure');
}

export function failure(): Failure;
export function failure<TFailure>(value: TFailure): Failure<TFailure>;
export function failure<TFailure>(value?: TFailure): Failure<TFailure> {
  return {
    type: 'failure',
    failure: value!,
  };
}

function hasProperty<T>(instance: T, propertyName: keyof T) {
  return Object.prototype.hasOwnProperty.call(instance, propertyName as keyof Success);
}
