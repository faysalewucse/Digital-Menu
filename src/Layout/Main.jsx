import React, { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Outlet } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

export const Main = () => {
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      success: {
        light: "#dcfce7",
        main: "#22c55e",
        dark: "#4ade80",
      },
    },
  });

  return (
    <div>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <Outlet />
      </ThemeProvider>
    </div>
  );
};
