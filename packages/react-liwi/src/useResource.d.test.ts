import { Query } from 'liwi-resources-client';
import { useResource } from './useResource';

interface Test {}

export function TestDataNotUndefinedWhenLoadingTrue(): void {
  const testResource = useResource(
    ((() => {}) as unknown) as (params: {}) => Query<Test[], {}>,
    {
      params: {},
    },
    [],
  );

  if (testResource.initialLoading) return;
  if (testResource.initialError) return;

  console.log(testResource.data[0]);
}

export function TestDataNotUndefinedWhenLoadingTrueWhenDestructuring(): void {
  const { initialLoading, data: tests } = useResource(
    ((() => {}) as unknown) as (params: {}) => Query<Test[], {}>,
    {
      params: {},
    },
    [],
  );

  if (initialLoading) return;

  // @ts-expect-error
  console.log(tests[0]);
}

export function TestParamsUndefined(): void {
  const { initialLoading, data: tests } = useResource(
    ((() => {}) as unknown) as (params: undefined) => Query<Test[], undefined>,
    {},
    [],
  );

  if (initialLoading) return;

  // @ts-expect-error
  console.log(tests[0]);
}

export function TestParamsShouldBeRequired(): void {
  const { initialLoading, data: tests } = useResource(
    ((() => {}) as unknown) as (params: {}) => Query<Test[], {}>,
    // @ts-expect-error
    {},
    [],
  );

  if (initialLoading) return;

  // @ts-expect-error
  console.log(tests[0]);
}

/* Alternatives

const tests = useResource();
if (tests.loading) return;
console.log(tests[0]);

const { data: tests } = useResource();
if (!data) return;
console.log(tests[0]);

///////

const { loading, data: test } = useSingleItemResource();

// bad: can be null
if (!data) return;
console.log(tests[0]);

*/
