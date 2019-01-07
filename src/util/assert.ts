export function assertNever(_: never): never {
  throw new Error('this function should never be called');
}
