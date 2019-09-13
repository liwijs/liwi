import { BaseModel } from 'liwi-types';

export interface QueryDescription<Params extends Record<string, any> | void, Model extends BaseModel> {
  params: Params;
  value: Model;
}


export interface OperationDescription<Params extends Record<string, any>, Result> {
  params: Params;
  result: Result;
}

export type QueryDescriptions<Keys extends keyof any = string> = Record<Keys, QueryDescription<any, any>>
export type OperationDescriptions<Keys extends keyof any = string> = Record<Keys, OperationDescription<any, any>>;
