import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./base.query";
import type {
  GetNotificationsParams,
  NotificationResponse,
  NotificationsApiResponse,
  MarkReadResponse,
} from "../../types";

export const alertApi = createApi({
  reducerPath: "alertApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Notification"],
  endpoints: (builder) => ({
    getNotifications: builder.query<
      NotificationResponse[],
      GetNotificationsParams
    >({
      query: ({ limit = 50, unreadOnly = false, cursor } = {}) => {
        let url = `/notifications?limit=${limit}&unreadOnly=${unreadOnly}`;
        if (cursor) url += `&cursor=${cursor}`;
        return url;
      },
      transformResponse: (response: NotificationsApiResponse) =>
        response.notifications,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "Notification" as const,
                id,
              })),
              { type: "Notification", id: "LIST" },
            ]
          : [{ type: "Notification", id: "LIST" }],
    }),

    markAsRead: builder.mutation<MarkReadResponse, string>({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}/read`,
        method: "PATCH",
      }),
      transformResponse: (response: MarkReadResponse) => response,
      invalidatesTags: (_result, _error, notificationId) => [
        { type: "Notification", id: notificationId },
        { type: "Notification", id: "LIST" },
      ],
    }),

    markAllAsRead: builder.mutation<MarkReadResponse, void>({
      query: () => ({
        url: `/notifications/read-all`,
        method: "PATCH",
      }),
      transformResponse: (response: MarkReadResponse) => response,
      invalidatesTags: [{ type: "Notification", id: "LIST" }],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} = alertApi;
