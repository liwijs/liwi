import { Component, ReactNode, ComponentType } from 'react';
import { AbstractQuery } from 'liwi-store';
interface LoadingProps {
}
interface Props<Name extends string, Value, CreateQueryParams> {
    component: ComponentType<{
        [P in Name]: Value[];
    }>;
    loadingComponent?: ComponentType<LoadingProps>;
    name: Name;
    createQuery: (params: CreateQueryParams) => AbstractQuery<Value>;
    params: CreateQueryParams;
    visibleTimeout?: number;
}
interface State<Result> {
    fetched: boolean;
    result: Result | undefined;
}
export default class FindAndSubscribeComponent<Name extends string, Value, CreateQueryParams> extends Component<Props<Name, Value, CreateQueryParams>, State<Value[]>> {
    static defaultProps: {
        visibleTimeout: number;
    };
    state: {
        fetched: boolean;
        result: undefined;
    };
    private timeout;
    private _subscribe;
    private query?;
    componentDidMount(): void;
    componentWillUnmount(): void;
    private handleVisibilityChange;
    private subscribe;
    private unsubscribe;
    render(): ReactNode;
}
export {};
//# sourceMappingURL=FindAndSubscribe.d.ts.map