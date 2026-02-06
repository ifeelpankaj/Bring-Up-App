import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authApi } from "../api/auth.api";
import type {
  UserResponseData,
  LoginResponse,
  UserProfileResponse,
} from "../../types";

/**
 * User type for auth state
 */
export type User = UserResponseData;

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isNewUser: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isNewUser: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ user: User; isNewUser: boolean }>,
    ) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isNewUser = action.payload.isNewUser;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isNewUser = false;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }: { payload: LoginResponse }) => {
        state.user = payload.user;
        state.isAuthenticated = true;
        state.isNewUser = payload.isNewUser;
      },
    );

    builder.addMatcher(
      authApi.endpoints.me.matchFulfilled,
      (state, { payload }: { payload: UserProfileResponse }) => {
        state.user = payload.user;
        state.isAuthenticated = true;
        state.isNewUser = false;
      },
    );

    builder.addMatcher(authApi.endpoints.me.matchRejected, (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isNewUser = false;
    });
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
