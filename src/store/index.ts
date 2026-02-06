/**
 * Redux Store Configuration
 *
 * Central store configuration with RTK Query APIs.
 */

import { configureStore } from "@reduxjs/toolkit";
import authApi from "./api/auth.api";
import authReducer from "./slices/auth.slice";
import { taskApi } from "./api/task.api";
import { alertApi } from "./api/alert.api";

/**
 * Configure the Redux store with all reducers and middleware
 */
export const store = configureStore({
  reducer: {
    // Auth state slice
    auth: authReducer,
    // RTK Query API slices
    [authApi.reducerPath]: authApi.reducer,
    [taskApi.reducerPath]: taskApi.reducer,
    [alertApi.reducerPath]: alertApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serialization checks
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    })
      .concat(authApi.middleware)
      .concat(taskApi.middleware)
      .concat(alertApi.middleware),
  // Enable Redux DevTools in development
  devTools: __DEV__,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
