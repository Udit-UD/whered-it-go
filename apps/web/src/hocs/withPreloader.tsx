import { AppDispatch } from '@/store';
import { useAppDispatch } from '@/store/hooks';
import React, { useState, useEffect, ComponentType } from 'react';

// Types
interface ApiCall<T = unknown> {
  key: string;
  fn: () => Promise<T>;
}

interface PreloaderConfig<T = Record<string, unknown>> {
  apiCalls: ApiCall<unknown>[];
  onSuccess?: (data: T, dispatch: AppDispatch) => void;
  onError?: (error: Error) => void;
  timeout?: number;
}

interface PreloaderProps {
  isLoading: boolean;
  preloadedData?: Record<string, unknown>;
  error?: Error | null;
  retry?: () => void;
}

interface PreloaderState {
  isLoading: boolean;
  data: Record<string, unknown>;
  error: Error | null;
}

// Next.js page props interface (Next.js 15+)
interface NextPageProps {
  params?: Promise<Record<string, string | string[]>>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

// HOC Factory
function withPreloader<P extends object = {}>(
  WrappedComponent: ComponentType<P & PreloaderProps>,
  config: PreloaderConfig
) {
  const { apiCalls, onSuccess, onError, timeout = 10000 } = config;

  const PreloaderHOC = (props: any) => {
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

    // We only want to run this once on mount
    useEffect(() => {
      if (apiCalls.length > 0) {
        executeApiCalls();
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Pass all props to the wrapped component along with preloader state
    return (
      <WrappedComponent
        {...props}
        preloadedData={state.data}
        isLoading={state.isLoading}
        error={state.error}
        retry={executeApiCalls}
      />
    );
  };

  // Set display name for debugging
  PreloaderHOC.displayName = `withPreloader(${WrappedComponent.displayName || WrappedComponent.name})`;

  return PreloaderHOC;
}

export default withPreloader;
export type { ApiCall, PreloaderConfig, PreloaderProps, NextPageProps };
