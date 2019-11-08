import { Reducer } from 'react';

export interface InitialState {
  fetched: false;
  promise: Promise<void>;
}

export interface FetchedState<Result> {
  fetched: true;
  result: Result;
}

export interface InitAction {
  type: 'init';
}

export interface ResolveAction<Result> {
  type: 'resolve';
  result: Result;
}

export type Action<Result> = ResolveAction<Result>;
export type State<Result> = InitialState | FetchedState<Result>;
export type ResourceReducer<Result> = Reducer<State<Result>, Action<Result>>;

export function initReducer(initializer: () => Promise<void>): InitialState {
  return {
    fetched: false,
    promise: initializer(),
  };
}

export default function reducer<Result>(
  state: State<Result>,
  action: Action<Result>,
): State<Result> {
  switch (action.type) {
    case 'resolve':
      return {
        fetched: true,
        result: action.result,
      };
    default:
      throw new Error('Invalid action');
  }
}
