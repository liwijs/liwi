import { useCallback, useState } from 'react';

export interface OperationState {
  loading: boolean;
  error: Error | undefined;
}

export type OperationCallWrapper<T extends (...args: any) => Promise<any>> = (
  ...args: Parameters<T>
) => Promise<[Error | any | undefined, Awaited<ReturnType<T>> | undefined]>;

export function useOperation<T extends (...args: any) => Promise<any>>(
  operationCall: T,
): [OperationCallWrapper<T>, OperationState] {
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
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
          error: err as Error,
        });
        return Promise.resolve([err, undefined]);
      }
    },
    [operationCall],
  );
  return [operationCallWrapper, state];
}
