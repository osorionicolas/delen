import Navbar from "../components/navbar"
import "./globals.css"
import { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { DownloadableFilesProvider } from "@/hooks/useDownloadableFiles"
import { TextProvider } from "@/hooks/useText"
import { Toaster } from "@/components/ui/toaster"

const APP_NAME = "Delen"
const APP_DESCRIPTION = "A file and text syncronization app"

export const fetchCache = "default-no-store"

export const metadata: Metadata = {
    title: APP_NAME,
    applicationName: APP_NAME,
    description: APP_DESCRIPTION,
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: APP_NAME,
        // startUpImage: [],
    },
    formatDetection: {
        telephone: false,
    },
    openGraph: {
        type: "website",
        siteName: APP_NAME,
        title: APP_NAME,
        description: APP_DESCRIPTION,
    },
    twitter: {
        card: "summary",
        title: APP_NAME,
        description: APP_DESCRIPTION,
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
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
                            <Toaster />
                        </TextProvider>
                    </DownloadableFilesProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
