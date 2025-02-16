"use client";

import { Toaster } from "@/components/ui/toaster";
import { DownloadableFilesProvider } from "@/hooks/useDownloadableFiles";
import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

export const AppWrapper = ({ children }: { children: ReactNode }) => {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
            <QueryClientProvider client={queryClient}>
                <DownloadableFilesProvider>
                    {children}
                    <Toaster />
                </DownloadableFilesProvider>
            </QueryClientProvider>
        </ThemeProvider>
    );
};