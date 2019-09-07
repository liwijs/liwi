import { BaseModel } from 'liwi-types';

export interface QueryDescription<Params extends Record<string, any>, Model extends BaseModel> {
  params: Params;
  value: Model;
}


export interface OperationDescription<Params extends Record<string, any>, Result> {
  params: Params;
  result: Result;
}

export type QueryDescriptions<Keys  = string> = Record<Keys, QueryDescription<any, any>>
export type OperationDescriptions<Keys  = string> = Record<Keys, OperationDescription<any, any>>;
