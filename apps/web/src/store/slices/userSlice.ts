import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  firstName: string;
  lastName: string;
  profilePicture: string;
  isAuthenticated: boolean;
  email: string;
  monthlyBudget?: number; // Optional field for monthly budget
}

const initialState: UserState = {
  firstName: '',
  lastName: '',
  profilePicture: '',
  isAuthenticated: false,
  email: '',
  monthlyBudget: 0, // Initialize as zero
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<UserState>>) => {
      return { ...state, ...action.payload };
    },
    setUserProfilePicture: (state, action: PayloadAction<string>) => {
      state.profilePicture = action.payload;
    },
    clearUser: () => {
      return initialState;
    },
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
  },
});

export const { setUser, clearUser, setAuthenticated } = userSlice.actions;
export default userSlice.reducer;
