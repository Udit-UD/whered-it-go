import { signInWithPopup, signInWithRedirect, getRedirectResult, AuthError } from 'firebase/auth';
import { auth, provider } from '@/firebase';

interface AuthResponse {
  success: boolean;
  data?: {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      authProvider: string;
    };
    token: string;
  };
  message?: string;
  errors?: Array<{ field: string; message: string }>;
}

interface GoogleLoginOptions {
  onSuccess?: (response: AuthResponse) => void;
  onError?: (error: string) => void;
  useRedirect?: boolean; // Option to use redirect instead of popup
}

// Function to detect if popups are likely to be blocked
const isPopupLikelyBlocked = (): boolean => {
  // Check if we're on mobile (popups often don't work well on mobile)
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  return isMobile;
};

// Function to handle redirect result (call this on page load)
export const handleRedirectResult = async (): Promise<AuthResponse | null> => {
  try {
    const result = await getRedirectResult(auth);
    if (!result || !result.user) {
      return null; // No redirect result
    }

    const idToken = await result.user.getIdToken(true);
    return await sendTokenToBackend(idToken);
  } catch (error) {
    console.error('Error handling redirect result:', error);
    return {
      success: false,
      message: 'Failed to complete redirect authentication',
    };
  }
};

// Shared function to send token to backend
const sendTokenToBackend = async (idToken: string): Promise<AuthResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/oauth/google`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ idToken }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  const data: AuthResponse = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'Authentication failed');
  }

  // Store token in localStorage (in production, consider httpOnly cookies)
  if (data.data?.token) {
    localStorage.setItem('authToken', data.data.token);
  }

  return data;
};

const handleGoogleLogin = async (options?: GoogleLoginOptions): Promise<AuthResponse> => {
  try {
    // Clear any existing auth state
    await auth.signOut();

    // First, try popup method unless on mobile or explicitly requested redirect
    let shouldTryRedirect = options?.useRedirect || isPopupLikelyBlocked();

    if (!shouldTryRedirect) {
      try {
        const result = await signInWithPopup(auth, provider);

        if (!result.user) {
          throw new Error('No user data received from Google');
        }

        // Get fresh ID token
        const idToken = await result.user.getIdToken(true);

        if (!idToken) {
          throw new Error('Failed to get ID token from Google');
        }

        const data = await sendTokenToBackend(idToken);

        console.log('Google login successful', data);
        options?.onSuccess?.(data);

        return data;
      } catch (popupError) {
        const error = popupError as AuthError;

        // If popup is blocked, try redirect method
        if (error.code === 'auth/popup-blocked' || error.code === 'auth/cancelled-popup-request') {
          console.log('Popup blocked, trying redirect method...');
          shouldTryRedirect = true;
        } else {
          throw popupError; // Re-throw other errors
        }
      }
    }

    // Use redirect method as fallback or if explicitly requested
    if (shouldTryRedirect) {
      await signInWithRedirect(auth, provider);
      // The actual authentication will complete on redirect back
      return {
        success: true,
        message: 'Redirecting to Google for authentication...',
      };
    }

    // This should never be reached, but just in case
    throw new Error('Authentication method selection failed');
  } catch (error: unknown) {
    // Sign out from Firebase on error to clean up state
    try {
      await auth.signOut();
    } catch (signOutError) {
      console.warn('Failed to sign out from Firebase after error:', signOutError);
    }

    let errorMessage = 'Google Sign-in failed';

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null && 'code' in error) {
      const authError = error as AuthError;
      switch (authError.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = 'Sign-in was cancelled';
          break;
        case 'auth/popup-blocked':
          errorMessage = 'Popup was blocked by the browser';
          break;
        case 'auth/cancelled-popup-request':
          errorMessage = 'Only one popup request is allowed at a time';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error occurred. Please check your connection';
          break;
        default:
          errorMessage = `Authentication error: ${authError.message}`;
      }
    }

    console.error('Google Sign-in Error:', error);
    options?.onError?.(errorMessage);

    return {
      success: false,
      message: errorMessage,
    };
  }
};

// Helper function to get stored auth token
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
};

// Helper function to clear auth token
export const clearAuthToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('authToken');
};

// Helper function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  if (!token) return false;

  try {
    // Basic token format validation (in production, verify signature)
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp > Date.now() / 1000;
  } catch {
    clearAuthToken();
    return false;
  }
};

export { handleGoogleLogin as default, type AuthResponse, type GoogleLoginOptions };
