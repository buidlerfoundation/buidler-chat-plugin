"use client";

import { Provider } from "react-redux";
import store from "store";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useMemo } from "react";
import data from "@emoji-mart/data";
import { init } from "emoji-mart";
init({ data });

export function Providers({ children }: { children: React.ReactNode }) {
  const materialTheme = useMemo(
    () =>
      createTheme({
        typography: {
          fontFamily: `-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif`,
          fontWeightMedium: 600,
          fontWeightBold: "bold",
        },
      }),
    []
  );
  return (
    <Provider store={store}>
      <ThemeProvider theme={materialTheme}>
        {children}
        <CssBaseline />
      </ThemeProvider>
    </Provider>
  );
}
