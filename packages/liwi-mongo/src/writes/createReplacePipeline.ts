import type { Document } from "mongodb";
import type { MongoBaseModel } from "../MongoBaseModel.ts";

/**
 * Replaces the stored document with `replacement` while keeping the stored `created`
 * (falling back to the replacement's when the stored document has none).
 * `$literal` keeps string values starting with `$` from being read as field paths.
 * Update pipelines require MongoDB >= 4.2.
 */
export const createReplacePipeline = (
  replacement: MongoBaseModel<any>,
): Document[] => [
  {
    $replaceWith: {
      $mergeObjects: [
        { $literal: replacement },
        {
          created: { $ifNull: ["$created", { $literal: replacement.created }] },
        },
      ],
    },
  },
];
