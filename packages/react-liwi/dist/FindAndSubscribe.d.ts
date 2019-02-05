import { Component, ReactNode, ComponentType } from 'react';
import { BaseModel } from 'liwi-types';
import { AbstractQuery } from 'liwi-store';
interface LoadingProps {
}
interface Props<Name extends string, Model extends BaseModel> {
    component: ComponentType<{
        [P in Name]: Model[];
    }>;
    loadingComponent?: ComponentType<LoadingProps>;
    name: Name;
    query: AbstractQuery<Model>;
    visibleTimeout?: number;
}
interface State<Result> {
    fetched: boolean;
    result: Result | undefined;
}
export default class FindAndSubscribeComponent<Name extends string, Model extends BaseModel> extends Component<Props<Name, Model>, State<Model[]>> {
    static defaultProps: {
        visibleTimeout: number;
    };
    state: {
        fetched: boolean;
        result: undefined;
    };
    private timeout;
    private _subscribe;
    componentDidMount(): void;
    componentWillUnmount(): void;
    private handleVisibilityChange;
    private subscribe;
    private unsubscribe;
    render(): ReactNode;
}
export {};
//# sourceMappingURL=FindAndSubscribe.d.ts.map