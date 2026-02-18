import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserWithRelations } from "@/types/api";

// Define the state interface
interface UserState {
  currentUser: UserWithRelations | null;
  selectedUser: UserWithRelations | null;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: UserState = {
  currentUser: null,
  selectedUser: null,
  isLoading: false,
  error: null,
};

// Create the slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser: (
      state,
      action: PayloadAction<UserWithRelations | null>
    ) => {
      state.currentUser = action.payload;
    },
    setSelectedUser: (
      state,
      action: PayloadAction<UserWithRelations | null>
    ) => {
      state.selectedUser = action.payload;
    },
    updateUserProfile: (
      state,
      action: PayloadAction<Partial<UserWithRelations>>
    ) => {
      if (state.currentUser) {
        state.currentUser = {
          ...state.currentUser,
          ...action.payload,
        };
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearUserState: (state) => {
      state.currentUser = null;
      state.selectedUser = null;
      state.error = null;
    },
  },
});

export const {
  setCurrentUser,
  setSelectedUser,
  updateUserProfile,
  setLoading,
  setError,
  clearUserState,
} = userSlice.actions;

export default userSlice.reducer;
