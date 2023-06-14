import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { useEffect, useState } from "react";
import { DarkMode, Fastfood, LightMode } from "@mui/icons-material";
import { useQueryClient } from "@tanstack/react-query";

const navItems = ["Products", "Pricing", "Blog"];

export const Navbar = ({ darkMode, setDarkMode }) => {
  const [anchorElNav, setAnchorElNav] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static" color="success">
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingY: 2,
          }}
        >
          <Fastfood
            sx={{
              display: { color: "white", fontSize: 45 },
              mr: 1,
            }}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              fontFamily: "poppins",
              fontWeight: 700,
              fontSize: 25,
              color: "white",
              textDecoration: "none",
            }}
          >
            Digital Menu Card
          </Typography>

          {/* Dark/Light Button */}
          <IconButton
            onClick={() => setDarkMode(!darkMode)}
            sx={{
              p: 0.5,
              border: 1,
              borderRadius: 1,
              borderColor: darkMode ? "#ffffff" : "#000000",
            }}
          >
            {darkMode ? (
              <LightMode fontSize="small" />
            ) : (
              <DarkMode fontSize="small" />
            )}
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
