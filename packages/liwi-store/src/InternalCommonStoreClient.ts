import { BaseModel, Criteria, Update } from 'liwi-types';

export interface InternalCommonStoreClient<Model extends BaseModel> {
  findByKey(key: any, criteria?: Criteria<Model>): Promise<Model | undefined>;

  replaceOne(object: Model): Promise<Model>;

  partialUpdateByKey(
    key: any,
    partialUpdate: Update<Model>,
    criteria?: Criteria<Model>,
  ): Promise<Model>;

  deleteByKey(key: any, criteria?: Criteria<Model>): Promise<void>;
}
