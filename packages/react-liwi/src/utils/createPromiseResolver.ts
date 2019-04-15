export const createPromiseResolver = () => {
  let resolve;
  const promise = new Promise<void>((r) => {
    resolve = r;
  });
  return { resolve: (resolve as unknown) as () => void, promise };
};
