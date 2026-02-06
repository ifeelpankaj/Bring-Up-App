import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./base.query";
import type { TaskResponse, PaginationMeta } from "../../types/task.types";
import type {
  TaskApiResponse,
  TasksApiResponse,
  TaskDeleteResponse,
  CreateTaskDto,
  UpdateTaskStatusDto,
  UpdateTaskReactionDto,
  GetMyTasksParams,
} from "../../types/api.types";

// Infinite scroll response type
interface InfiniteTasksResponse {
  items: TaskResponse[];
  meta: PaginationMeta;
}

export const taskApi = createApi({
  reducerPath: "taskApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Task", "MyTasks"],
  endpoints: (builder) => ({
    createTask: builder.mutation<TaskResponse, CreateTaskDto>({
      query: (createTaskDto) => ({
        url: "/tasks",
        method: "POST",
        body: createTaskDto,
      }),
      transformResponse: (response: TaskApiResponse) => response.task,
      invalidatesTags: [{ type: "MyTasks", id: "created" }],
    }),

    getTaskById: builder.query<TaskResponse, string>({
      query: (taskId) => `/tasks/${taskId}`,
      transformResponse: (response: TaskApiResponse) => response.task,
      providesTags: (_result, _error, taskId) => [{ type: "Task", id: taskId }],
    }),

    getMyTasks: builder.query<TaskResponse[], GetMyTasksParams>({
      query: ({ type, page = 1, limit = 50 }) =>
        `/tasks/my-tasks?type=${type}&page=${page}&limit=${limit}`,
      transformResponse: (response: TasksApiResponse) => response.items || [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Task" as const, id })),
              { type: "Task", id: "LIST" },
            ]
          : [{ type: "Task", id: "LIST" }],
    }),

    // Infinite scroll version of getMyTasks
    getMyTasksInfinite: builder.query<InfiniteTasksResponse, GetMyTasksParams>({
      query: ({ type, page = 1, limit = 20 }) =>
        `/tasks/my-tasks?type=${type}&page=${page}&limit=${limit}`,
      transformResponse: (response: TasksApiResponse) => {
        return {
          items: response.items || [],
          meta: response.meta || {
            currentPage: 1,
            itemsPerPage: 20,
            totalItems: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        };
      },
      // Merge pages together for infinite scroll
      serializeQueryArgs: ({ queryArgs }) => queryArgs.type,
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 1) {
          // Fresh load - replace all
          return newItems;
        }
        // Append new items, avoiding duplicates
        const existingIds = new Set(currentCache.items.map((item) => item.id));
        const uniqueNewItems = newItems.items.filter(
          (item) => !existingIds.has(item.id),
        );
        return {
          items: [...currentCache.items, ...uniqueNewItems],
          meta: newItems.meta,
        };
      },
      forceRefetch: ({ currentArg, previousArg }) =>
        currentArg?.page !== previousArg?.page,
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: "Task" as const, id })),
              { type: "Task", id: "LIST" },
            ]
          : [{ type: "Task", id: "LIST" }],
    }),

    updateTaskStatus: builder.mutation<TaskResponse, UpdateTaskStatusDto>({
      query: ({ taskId, status }) => ({
        url: `/tasks/${taskId}/status`,
        method: "PATCH",
        body: { status },
      }),
      transformResponse: (response: TaskApiResponse) => response.task,
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: "Task", id: taskId },
        { type: "MyTasks", id: "created" },
        { type: "MyTasks", id: "assigned" },
      ],
    }),

    updateTaskReaction: builder.mutation<TaskResponse, UpdateTaskReactionDto>({
      query: ({ taskId, reaction }) => ({
        url: `/tasks/${taskId}/reaction`,
        method: "PATCH",
        body: { reaction },
      }),
      transformResponse: (response: TaskApiResponse) => response.task,
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: "Task", id: taskId },
        { type: "MyTasks", id: "assigned" },
      ],
    }),

    deleteTask: builder.mutation<TaskDeleteResponse, string>({
      query: (taskId) => ({
        url: `/tasks/${taskId}`,
        method: "DELETE",
      }),
      transformResponse: (response: TaskDeleteResponse) => response,
      invalidatesTags: (_result, _error, taskId) => [
        { type: "Task", id: taskId },
        { type: "MyTasks", id: "created" },
      ],
    }),

    completeTask: builder.mutation<TaskResponse, { taskId: string }>({
      query: ({ taskId }) => ({
        url: `/tasks/${taskId}/complete`,
        method: "PATCH",
      }),
      transformResponse: (response: TaskApiResponse) => response.task,
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: "Task", id: taskId },
        { type: "MyTasks", id: "created" },
        { type: "MyTasks", id: "assigned" },
      ],
    }),

    cancelTask: builder.mutation<TaskResponse, string>({
      query: (taskId) => ({
        url: `/tasks/${taskId}/cancel`,
        method: "PATCH",
      }),
      transformResponse: (response: TaskApiResponse) => response.task,
      invalidatesTags: (_result, _error, taskId) => [
        { type: "Task", id: taskId },
        { type: "MyTasks", id: "created" },
        { type: "MyTasks", id: "assigned" },
      ],
    }),
  }),
});

export const {
  useCreateTaskMutation,
  useGetTaskByIdQuery,
  useLazyGetTaskByIdQuery,
  useGetMyTasksQuery,
  useLazyGetMyTasksQuery,
  useGetMyTasksInfiniteQuery,
  useUpdateTaskStatusMutation,
  useUpdateTaskReactionMutation,
  useDeleteTaskMutation,
  useCompleteTaskMutation,
  useCancelTaskMutation,
} = taskApi;

export const { endpoints: taskEndpoints } = taskApi;
