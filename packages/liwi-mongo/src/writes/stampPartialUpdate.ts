import { ProtectedFieldUpdateError } from "liwi-store";
import type { BaseModel, Update } from "liwi-store";

type ProtectedField = "created" | "updated";

const protectedFields: readonly ProtectedField[] = ["created", "updated"];

const updatedOverrideOperators: ReadonlySet<string> = new Set([
  "$set",
  "$currentDate",
  "$max",
]);

const findProtectedField = (path: string): ProtectedField | undefined =>
  protectedFields.find(
    (field) => path === field || path.startsWith(`${field}.`),
  );

const listTouchedPaths = (
  operator: string,
  fields: Record<string, unknown>,
): string[] => {
  const keys = Object.keys(fields);
  if (operator !== "$rename") return keys;
  const renameTargets = Object.values(fields).filter(
    (target): target is string => typeof target === "string",
  );
  return [...keys, ...renameTargets];
};

const describeRejection = (
  field: ProtectedField,
  operator: string,
  path: string,
): string =>
  field === "created"
    ? `Cannot use ${operator} on "${path}": created is set on insert and never updated`
    : `Cannot use ${operator} on "${path}": updated can only be set with $set, $currentDate or $max`;

const validateProtectedFields = <Model extends BaseModel>(
  update: Update<Model>,
): { isUpdatedSetByCaller: boolean } => {
  let isUpdatedSetByCaller = false;
  const operations = Object.entries(
    update as Record<string, Record<string, unknown> | undefined>,
  );

  for (const [operator, fields] of operations) {
    if (!fields) continue;
    for (const path of listTouchedPaths(operator, fields)) {
      const field = findProtectedField(path);
      if (!field) continue;
      if (
        field === "updated" &&
        path === "updated" &&
        updatedOverrideOperators.has(operator)
      ) {
        isUpdatedSetByCaller = true;
        continue;
      }
      throw new ProtectedFieldUpdateError(
        describeRejection(field, operator, path),
      );
    }
  }

  return { isUpdatedSetByCaller };
};

/**
 * Throws `ProtectedFieldUpdateError` when the update touches `created`, or touches
 * `updated` with an operator other than `$set`, `$currentDate` or `$max`.
 * Otherwise returns the update with `updated` set to `now`, unless the caller sets
 * `updated` itself or `now` is `undefined`. The caller's update is never mutated.
 */
export const stampPartialUpdate = <Model extends BaseModel>(
  update: Update<Model>,
  now: Date | undefined,
): Update<Model> => {
  const { isUpdatedSetByCaller } = validateProtectedFields(update);
  if (isUpdatedSetByCaller || !now) return update;
  const $set: Record<string, unknown> = { ...update.$set, updated: now };
  return { ...update, $set: $set as Update<Model>["$set"] };
};
