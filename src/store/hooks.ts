/**
 * Redux Store Hooks
 *
 * Type-safe hooks for accessing Redux store.
 * Use these throughout the app instead of plain `useDispatch` and `useSelector`.
 */

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./index";

/**
 * Typed dispatch hook
 * @returns Typed dispatch function
 */
export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();

/**
 * Typed selector hook
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
