import { Component, ReactNode, ComponentType } from 'react';
import { BaseModel } from 'liwi-types';
import { AbstractQuery, AbstractStore } from 'liwi-store';
interface LoadingProps {
}
declare type Record<K extends string, T> = {
    [P in K]: T;
};
interface Props<Name extends string, Model extends BaseModel, Store extends AbstractStore<any, any, any, any, any>> {
    component: ComponentType<Record<Name, Array<Model>>>;
    loadingComponent?: ComponentType<LoadingProps>;
    name: Name;
    query: AbstractQuery<Model, Store>;
}
interface State<Result> {
    fetched: boolean;
    result: Result | undefined;
}
export default class FindAndSubscribeComponent<Name extends string, Model extends BaseModel, Store extends AbstractStore<Model, any, any, any, any>> extends Component<Props<Name, Model, Store>, State<Array<Model>>> {
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