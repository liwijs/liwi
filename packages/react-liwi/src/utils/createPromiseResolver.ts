type PromiseResolve<T> = (value: T | PromiseLike<T>) => void;

export const createPromiseResolver = <T>(): {
  resolve: PromiseResolve<T>;
  promise: Promise<T>;
} => {
  let resolve: PromiseResolve<T> | null = null;
  const promise = new Promise<T>((r) => {
    resolve = r;
  });
  return { resolve: resolve as NonNullable<typeof resolve>, promise };
};
