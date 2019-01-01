import { Component, ReactNode, ComponentType } from 'react';
import { AbstractQuery, AbstractStore } from 'liwi-store';
import { BaseModel } from 'liwi-types';
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
export default class FindComponent<Name extends string, Model extends BaseModel, Store extends AbstractStore<any, any, any, any, any>> extends Component<Props<Name, Model, Store>, State<Array<Model>>> {
    state: {
        fetched: boolean;
        result: undefined;
    };
    _find?: Promise<void>;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): ReactNode;
}
export {};
//# sourceMappingURL=Find.d.ts.map