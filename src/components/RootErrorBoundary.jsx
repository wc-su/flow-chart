import { useRouteError, isRouteErrorResponse } from 'react-router';

const RootErrorBoundary = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </>
    );
  }

  if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        {import.meta.env.DEV && (
          <>
            <p>The stack trace is:</p>
            <pre>{error.stack}</pre>
          </>
        )}
      </div>
    );
  }

  return <h1>Unknown Error</h1>;
};

export default RootErrorBoundary;
