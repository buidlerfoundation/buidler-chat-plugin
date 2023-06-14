"use client";
import React, { useMemo } from "react";
import SocketProvider from "./SocketProvider";
import AuthProvider from "./AuthProvider";
import ImageProvider from "./ImageProvider";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import data from "@emoji-mart/data";
import { init } from "emoji-mart";
import AppToastNotification from "components/AppToastNotification";
import { ReduxProvider } from "store/ReduxProvider";
init({ data });

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
    <ReduxProvider>
      <ThemeProvider theme={materialTheme}>
        <SocketProvider>
          <AuthProvider>
            <ImageProvider>{children}</ImageProvider>
            <AppToastNotification />
          </AuthProvider>
        </SocketProvider>
        <CssBaseline />
      </ThemeProvider>
    </ReduxProvider>
  );
};

export default Providers;
