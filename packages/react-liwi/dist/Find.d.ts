import { Component, ReactNode, ComponentType } from 'react';
import { AbstractQuery } from 'liwi-store';
import { BaseModel } from 'liwi-types';
interface LoadingProps {
}
declare type Record<K extends string, T> = {
    [P in K]: T;
};
interface Props<Name extends string, Model extends BaseModel> {
    component: ComponentType<Record<Name, Model[]>>;
    loadingComponent?: ComponentType<LoadingProps>;
    name: Name;
    query: AbstractQuery<Model>;
}
interface State<Result> {
    fetched: boolean;
    result: Result | undefined;
}
export default class FindComponent<Name extends string, Model extends BaseModel> extends Component<Props<Name, Model>, State<Model[]>> {
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