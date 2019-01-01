import SubscribeStore, {
  Actions as SubscribeStoreActions,
  Listener as SubscribeStoreListener,
} from './SubscribeStore';
import AbstractSubscribeQuery from './AbstractSubscribeQuery';

export type Actions<Model> = SubscribeStoreActions<Model>;
export type Listener<Model> = SubscribeStoreListener<Model>;

export { SubscribeStore, AbstractSubscribeQuery };
