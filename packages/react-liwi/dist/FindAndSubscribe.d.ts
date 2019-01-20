import { Component, ReactNode, ComponentType } from 'react';
import { BaseModel } from 'liwi-types';
import { AbstractQuery } from 'liwi-store';
interface LoadingProps {
}
interface Props<Name extends string, Model extends BaseModel> {
    component: ComponentType<{
        [P in Name]: Array<Model>;
    }>;
    loadingComponent?: ComponentType<LoadingProps>;
    name: Name;
    query: AbstractQuery<Model>;
}
interface State<Result> {
    fetched: boolean;
    result: Result | undefined;
}
export default class FindAndSubscribeComponent<Name extends string, Model extends BaseModel> extends Component<Props<Name, Model>, State<Array<Model>>> {
    state: {
        fetched: boolean;
        result: undefined;
    };
    _subscribe?: any;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): ReactNode;
}
export {};
//# sourceMappingURL=FindAndSubscribe.d.ts.map