export type ActionRunner = () => Promise<void> | undefined;

/**
 * Runs a subscription's actions in order: synchronously while nothing
 * asynchronous is pending, so a change reaches the subscriber during the write
 * call; behind the pending work otherwise (the initial fetch, a refetch), so a
 * refetch is never overtaken by an older change.
 */
export const createActionQueue = (
  initial: Promise<unknown>,
  onError: (error: unknown) => void,
): ((run: ActionRunner) => void) => {
  let tail: Promise<void> | undefined;

  const track = (promise: Promise<unknown>, isReported: boolean): void => {
    const current: Promise<void> = promise
      .then(
        () => {},
        (error: unknown) => {
          if (isReported) onError(error);
        },
      )
      .then(() => {
        if (tail === current) tail = undefined;
      });
    tail = current;
  };

  // its failure rejects the subscription itself
  track(initial, false);

  return (run) => {
    if (tail) {
      track(tail.then(run), true);
      return;
    }
    try {
      const pending = run();
      if (pending) track(pending, true);
    } catch (error: unknown) {
      onError(error);
    }
  };
};
