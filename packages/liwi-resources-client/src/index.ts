import { BaseModel } from 'liwi-types';
import { QueryDescriptions, OperationDescriptions } from 'liwi-resources';
import ClientQuery from './ClientQuery';
import AbstractClient from './AbstractClient';

export { default as AbstractClient } from './AbstractClient';

export type ResourcesClientQueries<
  Queries extends QueryDescriptions,
  KeyPath extends string = '_id'
> = {
  [P in keyof Queries]: (
    params: Queries[P]['params'],
  ) => ClientQuery<Queries[P]['value'], KeyPath>;
};

export type ResourcesClientOperations<
  Operations extends OperationDescriptions
> = {
  [P in keyof Operations]: (
    params: Operations[P]['params'],
  ) => Promise<Operations[P]['result']>;
};

export interface ResourcesClientService<
  Queries extends QueryDescriptions,
  Operations extends OperationDescriptions = {}
> {
  queries: ResourcesClientQueries<Queries>;
  operations: ResourcesClientOperations<Operations>;
}

interface CreateResourceClientOptions<QueryKeys, OperationKeys> {
  queries: QueryKeys[];
  operations: OperationKeys[];
}

export const createResourceClientService = <
  Queries extends QueryDescriptions<keyof Queries>,
  Operations extends OperationDescriptions<keyof Operations>,
  Model extends BaseModel,
  KeyPath extends string = '_id'
>(
  client: AbstractClient<Model, KeyPath>,
  options: CreateResourceClientOptions<keyof Queries, keyof Operations>,
): ResourcesClientService<Queries, Operations> => {
  const queries: Partial<ResourcesClientQueries<Queries, KeyPath>> = {};
  const operations: Partial<ResourcesClientOperations<Operations>> = {};

  options.queries.forEach((queryKey) => {
    queries[queryKey] = (params: any) =>
      client.createQuery(queryKey as string, params);
  });

  options.operations.forEach((operationKey: keyof Operations) => {
    operations[operationKey] = (params: any) =>
      client.send('do', [operationKey, params]);
  });

  return {
    queries: queries as ResourcesClientQueries<Queries>,
    operations: operations as ResourcesClientOperations<Operations>,
  };
};

/** @deprecated use createResourceClientService instead */
export const createResourceClient = createResourceClientService;
