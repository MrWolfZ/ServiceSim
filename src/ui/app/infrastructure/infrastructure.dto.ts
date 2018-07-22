export interface Ask<TKind extends string, TResponse> {
  kind: TKind;

  // this field will never be set; it just exists to allow the
  // TypeScript compiler to properly infer the response type
  // when asking this kind of query
  dto?: TResponse;
}

// @ts-ignore
export interface Tell<TKind extends string, TResponse = never> {
  kind: TKind;

  // this field will never be set; it just exists to allow the
  // TypeScript compiler to properly infer the response type
  // when telling this kind command
  dto?: TResponse;
}
