"use client"; // 👈 Mark this as a Client Component

import { ReactNode } from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Header from "./Header";
import Footer from "./Footer";

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <>
      <CssBaseline />
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header />
        <Box component="main" sx={{ flexGrow: 1, py: 4, px: { xs: 2, md: 4 } }}>
          {children}
        </Box>
        <Footer />
      </Box>
    </>
  );
}
