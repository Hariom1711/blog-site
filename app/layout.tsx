import { ReactNode } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import LayoutWrapper from "./components/LayoutWrapper";
// import LayoutWrapper from "../components/LayoutWrapper"; // Import the Client Component

export const metadata = {
  title: "Blog Site",
  description: "A Next.js powered blog with MUI and Prisma",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <LayoutWrapper>{children}</LayoutWrapper> {/* ✅ Use Client Component */}
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
