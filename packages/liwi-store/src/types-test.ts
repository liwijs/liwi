/* eslint-disable camelcase */
import type { BaseModel, Criteria } from "./types";

interface Test1 extends BaseModel {
  name: string;
  nested: {
    value: number;
  }[];
}

type CriteriaTest1 = Criteria<Test1>;

export const test1_properties: CriteriaTest1 = {
  name: "test",
  nested: [{ value: 1 }],
};

export const test1_arrayne: CriteriaTest1 = {
  name: "test",
  nested: { $ne: [] },
};

export const test1_array0ne: CriteriaTest1 = {
  name: "test",
  "nested.0": { $ne: { value: 9 } },
  "nested.1": { value: 2 },
  "nested.2.value": 3,
  "nested.3.value": { $ne: 4 },
  // @ts-expect-error -- invalid path
  "nested.4.invalid": 6,
};

export const test1_invalid: CriteriaTest1 = {
  // @ts-expect-error -- invalid path
  invalid: true,
};
