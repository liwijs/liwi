import { BaseModel } from 'liwi-types';

export interface QueryDescription<Params extends Record<string, any>, Model extends BaseModel> {
  params: Params;
  value: Model;
}


export interface OperationDescription<Params extends Record<string, any>, Result> {
  params: Params;
  result: Result;
}

export interface QueryDescriptions { [key: string]: QueryDescription<any, any> }
export interface OperationDescriptions { [key: string]: OperationDescription<any, any> }
