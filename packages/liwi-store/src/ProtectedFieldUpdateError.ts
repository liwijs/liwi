/**
 * A partial update touched `created`, or touched `updated` with an operator
 * other than `$set`, `$currentDate` or `$max`. Thrown before anything is written.
 */
export default class ProtectedFieldUpdateError extends Error {
  constructor(message = "Protected field update") {
    super(message);
    this.name = "ProtectedFieldUpdateError";
  }
}
