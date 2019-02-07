
export interface OperationDescription<Params extends Record<string, any>, Result> {
  params: Params;
  result: Result;
}

export type OperationDescriptions = { [key: string]: OperationDescription<any, any> }
