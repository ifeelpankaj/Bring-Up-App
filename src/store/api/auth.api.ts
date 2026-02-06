import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./base.query";
import { logError } from "../../config/env";
import type {
  LoginCredentials,
  LoginResponse,
  LogoutResponse,
  UserProfileResponse,
} from "../../types";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginCredentials>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: LoginResponse) => response,
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          logError("LoginAPI", err);
        }
      },
    }),

    logout: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      transformResponse: (response: LogoutResponse) => response,
    }),

    me: builder.query<UserProfileResponse, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      transformResponse: (response: UserProfileResponse) => response,
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useMeQuery } = authApi;

export default authApi;
