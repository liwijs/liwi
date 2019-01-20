import * as types from 'liwi-types';
import SubscribeStore, {
  Actions as SubscribeStoreActions,
  Listener as SubscribeStoreListener,
} from './SubscribeStore';
import AbstractSubscribeQuery from './AbstractSubscribeQuery';

export type BaseModel = types.BaseModel;

export type Actions<Model> = SubscribeStoreActions<Model>;
export type Listener<Model> = SubscribeStoreListener<Model>;

export { SubscribeStore, AbstractSubscribeQuery };
