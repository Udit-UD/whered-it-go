import React, { ComponentType } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface LoaderProps {
  isLoading: boolean;
  error?: Error | null;
  retry?: () => void;
}

interface LoaderConfig {
  LoadingComponent?: ComponentType<{ isLoading: boolean }>;
  ErrorComponent?: ComponentType<{ error: Error; retry?: () => void }>;
}

const DefaultLoader: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardContent className="flex flex-col items-center space-y-4 p-6">
          <div className="relative">
            <div className="border-muted border-t-primary h-12 w-12 animate-spin rounded-full border-4"></div>
          </div>
          <div className="space-y-2 text-center">
            <h2 className="text-lg font-semibold">Loading...</h2>
            <p className="text-muted-foreground text-sm">Please wait while we load your content</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const DefaultError: React.FC<{ error: Error; retry?: () => void }> = ({ error, retry }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="max-w-md p-6 text-center">
        <div className="mb-4 text-red-500">
          <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h2 className="mb-2 text-xl font-bold text-gray-800">Something went wrong</h2>
        <p className="mb-4 text-gray-600">{error.message}</p>
        {retry && (
          <button
            onClick={retry}
            className="rounded-lg bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

function withLoader<P extends object>(
  WrappedComponent: ComponentType<P>,
  config: LoaderConfig = {}
) {
  const { LoadingComponent = DefaultLoader, ErrorComponent = DefaultError } = config;
  const LoaderHOC = (props: P & LoaderProps) => {
    const { isLoading, error, retry, ...restProps } = props;

    if (isLoading) {
      return <LoadingComponent isLoading={isLoading} />;
    }

    if (error) {
      return <ErrorComponent error={error} retry={retry} />;
    }

    return <WrappedComponent {...(restProps as P)} />;
  };

  LoaderHOC.displayName = `withLoader(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return LoaderHOC;
}

export default withLoader;
export type { LoaderProps, LoaderConfig };
