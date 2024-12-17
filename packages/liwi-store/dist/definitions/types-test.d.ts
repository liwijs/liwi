import type { BaseModel, Criteria } from "./types";
interface Test1 extends BaseModel {
    name: string;
    nested: {
        value: number;
    }[];
}
type CriteriaTest1 = Criteria<Test1>;
export declare const test1_properties: CriteriaTest1;
export declare const test1_arrayne: CriteriaTest1;
export declare const test1_array0ne: CriteriaTest1;
export declare const test1_invalid: CriteriaTest1;
export {};
//# sourceMappingURL=types-test.d.ts.map