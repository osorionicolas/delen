import Navbar from "../components/navbar";
import "./globals.css";
import { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { DownloadableFilesProvider } from "@/hooks/useDownloadableFiles";
import { TextProvider } from "@/hooks/useText";

export const metadata: Metadata = {
  title: "Delen",
  description: "Delen",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <DownloadableFilesProvider>
            <TextProvider>
              <Navbar />
              {children}
            </TextProvider>
          </DownloadableFilesProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
