import { AbstractQuery } from 'liwi-store';
import { BaseModel } from 'liwi-types';
import WebsocketStore from './WebsocketStore';
declare type SubscribeReturn = {
    cancel: () => void;
    stop: () => void;
    then: (cb: any) => Promise<any>;
};
declare type Callback = (err: Error | null, result: any) => void;
export default class Query<Model extends BaseModel, KeyPath extends string> extends AbstractQuery<Model, WebsocketStore<Model, KeyPath>> {
    key: string;
    constructor(store: WebsocketStore<Model, KeyPath>, key: string);
    fetch(onFulfilled?: (value: any) => any): Promise<any>;
    _subscribe(callback: Callback, _includeInitial: boolean | undefined, args: Array<any>): SubscribeReturn;
}
export {};
//# sourceMappingURL=Query.d.ts.map