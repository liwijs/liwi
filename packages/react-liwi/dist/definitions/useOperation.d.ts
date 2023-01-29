export interface OperationState {
    loading: boolean;
    error: undefined | Error;
}
export type OperationCallWrapper<T extends (...args: any) => Promise<any>> = (...args: Parameters<T>) => Promise<[undefined | Error | any, undefined | Awaited<ReturnType<T>>]>;
export declare function useOperation<T extends (...args: any) => Promise<any>>(operationCall: T): [OperationCallWrapper<T>, OperationState];
//# sourceMappingURL=useOperation.d.ts.map