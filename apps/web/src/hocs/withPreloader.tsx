import { AppDispatch } from '@/store';
import { useAppDispatch } from '@/store/hooks';
import { Card, CardContent } from '@/components/ui/card';
import React, { useState, useEffect, ComponentType } from 'react';

// Types
interface ApiCall<T = unknown> {
  key: string;
  fn: () => Promise<T>;
}

interface PreloaderConfig<T = Record<string, unknown>> {
  apiCalls: ApiCall<unknown>[];
  LoadingComponent?: ComponentType<{ isLoading: boolean }>;
  onSuccess?: (data: T, dispatch: AppDispatch) => void;
  onError?: (error: Error) => void;
  timeout?: number;
}

interface PreloaderProps {
  isLoading?: boolean;
  preloadedData?: Record<string, unknown>;
}

interface PreloaderState {
  isLoading: boolean;
  data: Record<string, unknown>;
  error: Error | null;
}

// Default Loading Component
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

// HOC Factory
function withPreloader<P extends object>(
  WrappedComponent: ComponentType<P & PreloaderProps>,
  config: PreloaderConfig
) {
  const {
    apiCalls,
    LoadingComponent = DefaultLoader,
    onSuccess,
    onError,
    timeout = 10000,
  } = config;

  const PreloaderHOC = (props: P & { isLoading?: boolean }) => {
    const [state, setState] = useState<PreloaderState>({
      isLoading: true,
      data: {},
      error: null,
    });
    const dispatch = useAppDispatch();

    const executeApiCalls = async (): Promise<void> => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        // Create timeout promise
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), timeout);
        });

        // Execute all API calls concurrently
        const apiPromises = apiCalls.map(async apiCall => {
          const result = await Promise.race([apiCall.fn(), timeoutPromise]);
          return { key: apiCall.key, data: result };
        });

        const results = await Promise.all(apiPromises);

        // Transform results into data object
        const dataObject = results.reduce(
          (acc, result) => {
            acc[result.key] = result.data;
            return acc;
          },
          {} as Record<string, unknown>
        );

        setState({
          isLoading: false,
          data: dataObject,
          error: null,
        });

        // Call success callback
        if (onSuccess) {
          onSuccess(dataObject, dispatch);
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Unknown error occurred');

        setState({
          isLoading: false,
          data: {},
          error: err,
        });

        // Call error callback
        if (onError) {
          onError(err);
        }

        console.error('Preloader error:', err);
      }
    };

    useEffect(() => {
      if (apiCalls.length > 0) {
        executeApiCalls();
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    }, []);

    // Show loading state if internal loading or prop isLoading is true
    const shouldShowLoader = state.isLoading || props.isLoading;

    if (shouldShowLoader) {
      return <LoadingComponent isLoading={shouldShowLoader} />;
    }

    // Show error state
    if (state.error) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="max-w-md p-6 text-center">
            <div className="mb-4 text-red-500">
              <svg
                className="mx-auto h-16 w-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="mb-2 text-xl font-bold text-gray-800">Something went wrong</h2>
            <p className="mb-4 text-gray-600">{state.error.message}</p>
            <button
              onClick={executeApiCalls}
              className="rounded-lg bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    // Render wrapped component with preloaded data
    return <WrappedComponent {...props} preloadedData={state.data} isLoading={false} />;
  };

  // Set display name for debugging
  PreloaderHOC.displayName = `withPreloader(${WrappedComponent.displayName || WrappedComponent.name})`;

  return PreloaderHOC;
}

export default withPreloader;
export type { ApiCall, PreloaderConfig, PreloaderProps };
