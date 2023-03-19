export interface OperationState {
    loading: boolean;
    error: Error | undefined;
}
export type OperationCallWrapper<T extends (...args: any) => Promise<any>> = (...args: Parameters<T>) => Promise<[Error | any | undefined, Awaited<ReturnType<T>> | undefined]>;
export declare function useOperation<T extends (...args: any) => Promise<any>>(operationCall: T): [OperationCallWrapper<T>, OperationState];
//# sourceMappingURL=useOperation.d.ts.map