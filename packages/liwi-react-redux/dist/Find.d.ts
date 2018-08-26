import { Component, ReactNode, ComponentType } from 'react';
import { AbstractQuery, AbstractStore } from 'liwi-store';
interface LoadingProps {
}
declare type Record<K extends string, T> = {
    [P in K]: T;
};
interface Props<Name extends string, Result extends any, Store extends AbstractStore<any, any, any, any>> {
    component: ComponentType<Record<Name, Result>>;
    loadingComponent?: ComponentType<LoadingProps>;
    name: Name;
    query: AbstractQuery<Store>;
}
interface State<Result> {
    fetched: boolean;
    result: Result | undefined;
}
export default class FindComponent<Name extends string, Result extends any, Model, Store extends AbstractStore<any, any, any, any>> extends Component<Props<Name, Result, Store>, State<Result>> {
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