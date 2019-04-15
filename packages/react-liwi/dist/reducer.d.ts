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
export declare type Action<Result> = ResolveAction<Result>;
export declare type State<Result> = InitialState | FetchedState<Result>;
export declare type Reducer<Result> = Reducer<State<Result>, Action<Result>>;
export declare function initReducer(initializer: () => Promise<void>): InitialState;
export default function reducer<Result>(state: State<Result>, action: Action<Result>): State<Result>;
//# sourceMappingURL=reducer.d.ts.map