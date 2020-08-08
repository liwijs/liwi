import React, { ReactElement } from 'react';

export interface ErrorPageProps {
  onRetryClick: () => void;
}

export default function ErrorPage({
  onRetryClick,
}: ErrorPageProps): ReactElement {
  return (
    <>
      <div>Sorry, an unexpected error occured.</div>
      <div>
        <button type="button" onClick={onRetryClick}>
          Retry
        </button>
      </div>
    </>
  );
}
