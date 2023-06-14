"use client";
import React, { useMemo } from "react";
import SocketProvider from "./SocketProvider";
import AuthProvider from "./AuthProvider";
import ImageProvider from "./ImageProvider";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { Provider } from "react-redux";
import store from "store";

interface IProviders {
  children: React.ReactNode;
}

const Providers = ({ children }: IProviders) => {
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
        <SocketProvider>
          <AuthProvider>
            <ImageProvider>{children}</ImageProvider>
          </AuthProvider>
        </SocketProvider>
        <CssBaseline />
      </ThemeProvider>
    </Provider>
  );
};

export default Providers;
