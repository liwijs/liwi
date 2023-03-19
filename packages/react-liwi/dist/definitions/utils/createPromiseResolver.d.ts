type PromiseResolve<T> = (value: PromiseLike<T> | T) => void;
export declare const createPromiseResolver: <T>() => {
    resolve: PromiseResolve<T>;
    promise: Promise<T>;
};
export {};
//# sourceMappingURL=createPromiseResolver.d.ts.map