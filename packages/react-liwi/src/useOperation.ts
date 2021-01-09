import { useCallback, useState } from 'react';

export interface OperationState {
  loading: boolean;
  error: undefined | Error;
}

export type OperationCallWrapper<T extends (...args: any) => Promise<any>> = (
  ...args: Parameters<T>
) => Promise<[undefined | Error | any, undefined | ReturnType<T>]>;

export function useOperation<
  T extends (...args: any) => Promise<ReturnType<T>>
>(operationCall: T): [OperationCallWrapper<T>, OperationState] {
  const [state, setState] = useState<OperationState>(() => ({
    loading: false,
    error: undefined,
  }));

  const operationCallWrapper = useCallback<OperationCallWrapper<T>>(
    (...params: Parameters<T>) => {
      setState({
        loading: true,
        error: undefined,
      });
      try {
        return operationCall(...(params as any)).then(
          (result) => {
            setState({
              loading: false,
              error: undefined,
            });
            return [undefined, result];
          },
          (err) => {
            setState({
              loading: false,
              error: err,
            });
            return [err, undefined];
          },
        );
      } catch (err) {
        setState({
          loading: false,
          error: err,
        });
        return Promise.resolve([err, undefined]);
      }
    },
    [operationCall],
  );
  return [operationCallWrapper, state];
}
