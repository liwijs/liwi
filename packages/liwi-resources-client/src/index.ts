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
  ) => ClientQuery<Queries[P]['model'], KeyPath>
};

export type ResourcesClientOperations<
  Operations extends OperationDescriptions
> = {
  [P in keyof Operations]: (
    params: Operations[P]['params'],
  ) => Promise<Operations[P]['result']>
};

export interface ResourcesClientService<
  Queries extends QueryDescriptions,
  Operations extends OperationDescriptions = {}
> {
  queries: ResourcesClientQueries<Queries>;
  operations: ResourcesClientOperations<Operations>;
}

interface CreateResourceClientOptions<
  QueryKeys extends string,
  OperationKeys extends string
> {
  queries: QueryKeys[];
  operations: OperationKeys[];
}

export const createResourceClient = <
  Queries extends QueryDescriptions,
  Operations extends OperationDescriptions,
  Model extends BaseModel,
  KeyPath extends string = '_id'
>(
  client: AbstractClient<Model, KeyPath>,
  options: CreateResourceClientOptions<string, string>,
): ResourcesClientService<Queries, Operations> => {
  const queries: Partial<ResourcesClientQueries<Queries, KeyPath>> = {};
  const operations: Partial<ResourcesClientOperations<Operations>> = {};

  options.queries.forEach((queryKey: string) => {
    queries[queryKey] = (params: any) => client.createQuery(queryKey, params);
  });

  options.operations.forEach((operationKey: string) => {
    operations[operationKey] = (params: any) =>
      client.send('do', [operationKey, params]);
  });

  return {
    queries: queries as ResourcesClientQueries<Queries>,
    operations: operations as ResourcesClientOperations<Operations>,
  };
};
