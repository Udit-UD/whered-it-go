// Example usage of the API service
import apiService, { ApiService, ApiResponse } from '@/lib/apiService';

// Example interfaces for your application
interface User {
  id: string;
  name: string;
  email: string;
}

interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: 'expense' | 'income';
}

interface CreateTransactionData {
  description: string;
  amount: number;
  category: string;
  date: string;
  type: 'expense' | 'income';
}

// Example API service usage
export class ExampleApiUsage {
  // GET request example
  async getUser(userId: string): Promise<User | null> {
    try {
      const response: ApiResponse<User> = await apiService.get<User>(`/users/${userId}`);

      if (response.success) {
        console.log('User retrieved successfully:', response.data);
        return response.data;
      } else {
        console.error('Failed to get user:', response.status, response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  // POST request example
  async createTransaction(transactionData: CreateTransactionData): Promise<Transaction | null> {
    try {
      const response: ApiResponse<Transaction> = await apiService.post<Transaction>(
        '/transactions',
        transactionData
      );

      if (response.success) {
        console.log('Transaction created successfully:', response.data);
        return response.data;
      } else {
        console.error('Failed to create transaction:', response.status, response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error creating transaction:', error);
      return null;
    }
  }

  // PUT request example
  async updateUser(userId: string, userData: Partial<User>): Promise<User | null> {
    try {
      const response: ApiResponse<User> = await apiService.put<User>(`/users/${userId}`, userData);

      if (response.success) {
        console.log('User updated successfully:', response.data);
        return response.data;
      } else {
        console.error('Failed to update user:', response.status, response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }

  // PATCH request example
  async patchTransaction(
    transactionId: string,
    updates: Partial<Transaction>
  ): Promise<Transaction | null> {
    try {
      const response: ApiResponse<Transaction> = await apiService.patch<Transaction>(
        `/transactions/${transactionId}`,
        updates
      );

      if (response.success) {
        console.log('Transaction patched successfully:', response.data);
        return response.data;
      } else {
        console.error('Failed to patch transaction:', response.status, response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error patching transaction:', error);
      return null;
    }
  }

  // DELETE request example
  async deleteTransaction(transactionId: string): Promise<boolean> {
    try {
      const response: ApiResponse<void> = await apiService.delete<void>(
        `/transactions/${transactionId}`
      );

      if (response.success) {
        console.log('Transaction deleted successfully');
        return true;
      } else {
        console.error('Failed to delete transaction:', response.status, response.statusText);
        return false;
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      return false;
    }
  }

  // File upload example
  async uploadProfileImage(file: File): Promise<string | null> {
    try {
      const response: ApiResponse<{ url: string }> = await apiService.uploadFile<{ url: string }>(
        '/upload/profile-image',
        file,
        progressEvent => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          console.log(`Upload progress: ${percentCompleted}%`);
        }
      );

      if (response.success) {
        console.log('Image uploaded successfully:', response.data.url);
        return response.data.url;
      } else {
        console.error('Failed to upload image:', response.status, response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  }

  // Example with custom headers
  async getProtectedData(): Promise<unknown> {
    try {
      const response: ApiResponse<unknown> = await apiService.get('/protected-data', {
        headers: {
          'Custom-Header': 'custom-value',
        },
        timeout: 5000,
      });

      if (response.success) {
        console.log('Protected data retrieved:', response.data);
        return response.data;
      } else {
        console.error('Failed to get protected data:', response.status, response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error getting protected data:', error);
      return null;
    }
  }

  // Example with custom API service instance
  createCustomApiService(): ApiService {
    return new ApiService({
      baseURL: 'https://api.example.com',
      timeout: 15000,
      headers: {
        'Custom-App-Header': 'my-app-v1.0',
      },
    });
  }

  // Example of setting auth token
  async loginAndSetToken(email: string, password: string): Promise<boolean> {
    try {
      const response: ApiResponse<{ token: string; user: User }> = await apiService.post<{
        token: string;
        user: User;
      }>('/auth/login', {
        email,
        password,
      });

      if (response.success) {
        // Set the auth token for future requests
        apiService.setAuthToken(response.data.token);
        console.log('Login successful, token set');
        return true;
      } else {
        console.error('Login failed:', response.status, response.statusText);
        return false;
      }
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  }

  // Example of clearing auth token
  logout(): void {
    apiService.clearAuthToken();
    console.log('Logged out, token cleared');
  }
}

// React hook example for using the API service
export const useApiService = () => {
  const apiUsage = new ExampleApiUsage();

  return {
    getUser: apiUsage.getUser,
    createTransaction: apiUsage.createTransaction,
    updateUser: apiUsage.updateUser,
    patchTransaction: apiUsage.patchTransaction,
    deleteTransaction: apiUsage.deleteTransaction,
    uploadProfileImage: apiUsage.uploadProfileImage,
    getProtectedData: apiUsage.getProtectedData,
    loginAndSetToken: apiUsage.loginAndSetToken,
    logout: apiUsage.logout,
  };
};
