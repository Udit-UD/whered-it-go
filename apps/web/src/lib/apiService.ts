import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  AxiosProgressEvent,
} from 'axios';

// Types for API responses
export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  success: boolean;
  message?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  statusText?: string;
  data?: unknown;
}

// Configuration interface
export interface ApiConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

class ApiService {
  private axiosInstance: AxiosInstance;

  constructor(config: ApiConfig = {}) {
    this.axiosInstance = axios.create({
      baseURL: config.baseURL || process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
      timeout: config.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });

    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Add auth token if available
        const token = this.getAuthToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(this.handleError(error));
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private getAuthToken(): string | null {
    // Try to get token from localStorage (client-side) or other storage
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    }
    return null;
  }

  private handleError(error: AxiosError): ApiError {
    const apiError: ApiError = {
      message: error.message || 'An unexpected error occurred',
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    };

    // Handle specific error cases
    if (error.response?.status === 401) {
      apiError.message = 'Unauthorized. Please log in again.';
      // Optionally trigger logout or redirect
    } else if (error.response?.status === 403) {
      apiError.message = 'Forbidden. You do not have permission to access this resource.';
    } else if (error.response?.status === 404) {
      apiError.message = 'Resource not found.';
    } else if (error.response?.status === 500) {
      apiError.message = 'Internal server error. Please try again later.';
    }

    return apiError;
  }

  private formatResponse<T>(response: AxiosResponse<T>): ApiResponse<T> {
    const isApiResponse =
      response.data && typeof response.data === 'object' && 'success' in response.data;

    if (isApiResponse) {
      interface BackendResponse {
        success: boolean;
        data: unknown;
        message?: string;
      }

      const backendResponse = response.data as BackendResponse;
      return {
        data: backendResponse.data as T,
        status: response.status,
        statusText: response.statusText,
        success: backendResponse.success,
        message: backendResponse.message || response.statusText,
      };
    }

    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      success: response.status >= 200 && response.status < 300,
      message: response.statusText,
    };
  }

  // GET request
  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.get<T>(url, config);
      return this.formatResponse(response);
    } catch (error) {
      throw error;
    }
  }

  // POST request
  async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.post<T>(url, data, config);
      return this.formatResponse(response);
    } catch (error) {
      throw error;
    }
  }

  // PUT request
  async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.put<T>(url, data, config);
      return this.formatResponse(response);
    } catch (error) {
      throw error;
    }
  }

  // PATCH request
  async patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.patch<T>(url, data, config);
      return this.formatResponse(response);
    } catch (error) {
      throw error;
    }
  }

  // DELETE request
  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.delete<T>(url, config);
      return this.formatResponse(response);
    } catch (error) {
      throw error;
    }
  }

  // HEAD request
  async head<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.head<T>(url, config);
      return this.formatResponse(response);
    } catch (error) {
      throw error;
    }
  }

  // OPTIONS request
  async options<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.options<T>(url, config);
      return this.formatResponse(response);
    } catch (error) {
      throw error;
    }
  }

  // File upload with progress
  async uploadFile<T = unknown>(
    url: string,
    file: File,
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await this.axiosInstance.post<T>(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress,
      });
      return this.formatResponse(response);
    } catch (error) {
      throw error;
    }
  }

  // Set auth token
  setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }

  // Clear auth token
  clearAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
    }
  }

  // Update base URL
  updateBaseURL(baseURL: string): void {
    this.axiosInstance.defaults.baseURL = baseURL;
  }

  // Update default headers
  updateDefaultHeaders(headers: Record<string, string>): void {
    Object.assign(this.axiosInstance.defaults.headers, headers);
  }

  // Get axios instance for custom configurations
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

// Create and export a default instance
const apiService = new ApiService();

// Export both the class and the default instance
export { ApiService };
export default apiService;

// Utility functions for common API patterns
export const createApiService = (config: ApiConfig) => new ApiService(config);

// Request/Response type helpers
export type RequestConfig = AxiosRequestConfig;
export type ResponseType<T> = ApiResponse<T>;
export type ErrorType = ApiError;
