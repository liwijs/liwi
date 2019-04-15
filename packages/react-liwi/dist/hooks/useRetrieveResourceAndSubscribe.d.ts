import { BaseModel } from 'liwi-types';
import { AbstractQuery } from 'liwi-store';
interface UseResourceAndSubscribeOptions {
    visibleTimeout: number;
}
export default function useRetrieveResourceAndSubscribe<Model extends BaseModel>(createQuery: () => AbstractQuery<Model>, { visibleTimeout }?: UseResourceAndSubscribeOptions): import("../reducer").State<Model[]>;
export {};
//# sourceMappingURL=useRetrieveResourceAndSubscribe.d.ts.map