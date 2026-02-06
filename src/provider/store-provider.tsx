/**
 * Store Provider
 *
 * Redux store provider wrapper for the application.
 */

import React, { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "../store";

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Main providers wrapper component
 * Wraps the app with all necessary context providers
 */
export function Providers({ children }: ProvidersProps): JSX.Element {
  return <Provider store={store}>{children}</Provider>;
}

export default Providers;
