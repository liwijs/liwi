type PromiseResolve<T> = (value: T | PromiseLike<T>) => void;
export declare const createPromiseResolver: <T>() => {
    resolve: PromiseResolve<T>;
    promise: Promise<T>;
};
export {};
//# sourceMappingURL=createPromiseResolver.d.ts.map