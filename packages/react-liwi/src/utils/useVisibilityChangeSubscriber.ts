import { useMemo, useRef } from 'react';

type VisibilityChangeHandler = () => void;

interface VisibilityChangeSubscriber {
  subscribe: (handleVisibilityChange: VisibilityChangeHandler) => void;
  unsubscribe: () => void;
}

export const useVisibilityChangeSubscriber = (): VisibilityChangeSubscriber => {
  const handleVisibilityChangeRef = useRef<
    VisibilityChangeHandler | undefined
  >();
  return useMemo(
    () => ({
      subscribe: (handleVisibilityChange: VisibilityChangeHandler) => {
        handleVisibilityChangeRef.current = handleVisibilityChange;
        document.addEventListener(
          'visibilitychange',
          handleVisibilityChange,
          false,
        );
      },
      unsubscribe: () => {
        if (handleVisibilityChangeRef.current) {
          document.removeEventListener(
            'visibilitychange',
            handleVisibilityChangeRef.current,
          );
        }
      },
    }),
    [],
  );
};
