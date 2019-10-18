import { BaseModel } from 'liwi-types';
import { AbstractQuery } from 'liwi-store';
import { State } from '../reducer';
export default function useRetrieveResource<Model extends BaseModel>(createQuery: () => AbstractQuery<Model>): State<Model[]>;
//# sourceMappingURL=useRetrieveResource.d.ts.map