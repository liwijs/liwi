import { AbstractQuery } from 'liwi-store';
import { BaseModel } from 'liwi-types';
import AbstractClient from './AbstractClient';
interface SubscribeReturn {
    cancel: () => void;
    stop: () => void;
    then: (cb: any) => Promise<any>;
}
declare type Callback = (err: Error | null, result: any) => void;
export default class Query<Model extends BaseModel, KeyPath extends string> extends AbstractQuery<Model> {
    client: AbstractClient<Model, KeyPath>;
    key: string;
    constructor(client: AbstractClient<Model, KeyPath>, key: string);
    fetch(onFulfilled?: (value: any) => any): Promise<any>;
    _subscribe(callback: Callback, _includeInitial: boolean | undefined, args: any[]): SubscribeReturn;
}
export {};
//# sourceMappingURL=ClientQuery.d.ts.map