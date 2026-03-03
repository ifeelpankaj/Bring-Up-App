import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./base.query";
import { logError } from "../../config/env";
import type {
  LoginCredentials,
  LoginResponse,
  LogoutResponse,
  UserProfileResponse,
  UserSearchResponse,
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

    searchUsers: builder.query<UserSearchResponse, string>({
      query: (q) => ({
        url: `/auth/search?q=${encodeURIComponent(q)}`,
        method: "GET",
      }),
      transformResponse: (response: UserSearchResponse) => response,
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useMeQuery,
  useLazySearchUsersQuery,
} = authApi;

export default authApi;
