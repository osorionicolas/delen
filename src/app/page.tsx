"use client"

import FileDownload from "@/components/file-download"
import FileUpload from "@/components/file-upload"
import TextShare from "@/components/text-share"

const HomePage = () => {

    return (
        <main className="min-h-[96dvh] bg-background">
            <div className="container mx-auto py-8 px-4">
                <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    File & Text Sharing
                </h1>

                <div className="grid gap-8 md:grid-cols-2">
                    <div>
                        <TextShare />
                    </div>

                    <div className="space-y-8">
                        <FileUpload />
                        <FileDownload />
                    </div>
                </div>
            </div>
        </main>
    )
}

export default HomePage
