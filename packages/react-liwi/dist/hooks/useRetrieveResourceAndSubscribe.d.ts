import { BaseModel } from 'liwi-types';
import { AbstractQuery } from 'liwi-store';
export interface UseResourceAndSubscribeOptions {
    visibleTimeout: number;
}
export default function useRetrieveResourceAndSubscribe<Model extends BaseModel>(createQuery: () => AbstractQuery<Model>, { visibleTimeout }?: UseResourceAndSubscribeOptions): import("../reducer").State<Model[]>;
//# sourceMappingURL=useRetrieveResourceAndSubscribe.d.ts.map