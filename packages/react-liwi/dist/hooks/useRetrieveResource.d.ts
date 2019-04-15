import { BaseModel } from 'liwi-types';
import { AbstractQuery } from 'liwi-store';
export default function useRetrieveResource<Model extends BaseModel>(createQuery: () => AbstractQuery<Model>): import("../reducer").State<Model[]>;
//# sourceMappingURL=useRetrieveResource.d.ts.map