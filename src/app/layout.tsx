import "./globals.css"
import { Metadata } from "next"
import { AppWrapper } from "./app-wrapper"
import Navbar from "@/components/navbar"

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
                <Navbar />
                <AppWrapper>{children}</AppWrapper>
            </body>
        </html>
    )
}
