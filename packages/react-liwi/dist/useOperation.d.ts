export interface OperationState {
    loading: boolean;
    error: undefined | any;
}
export declare type OperationCallWrapper<T extends (...args: any) => Promise<any>> = (...args: Parameters<T>) => Promise<[undefined | Error | any, undefined | ReturnType<T>]>;
export declare function useOperation<T extends (...args: any) => Promise<any>>(operationCall: T): [OperationCallWrapper<T>, OperationState];
//# sourceMappingURL=useOperation.d.ts.map