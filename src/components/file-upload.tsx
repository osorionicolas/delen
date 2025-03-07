"use client"
import React, { useState } from "react"
import Autocomplete from "@/components/autocomplete"
import { Button } from "./ui/button"
import { useDownloadableFiles } from "@/hooks/useDownloadableFiles"
import { toast } from "./ui/use-toast"
import { Dropzone } from "./dropzone"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"

const FileUpload = () => {
    const [path, setPath] = useState<any>(null)
    const [files, setFiles] = useState([])
    const { downloadableFiles, fetchFiles } = useDownloadableFiles()

    const handleSave = () => {
        files.forEach((file: any) => {
            const data = new FormData()
            data.append("file", file)
            let query = ""
            if (path) query = `?path=${path}`
            fetch(`/api/files${query}`, {
                method: "POST",
                body: data,
            })
        })
        toast({
            description: "Files uploaded successfully!",
            variant: "success",
        })
        setFiles([])
        fetchFiles()
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Upload files
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Autocomplete
                    downloadableFiles={downloadableFiles}
                    setPath={setPath}
                />
                <Dropzone
                    files={files}
                    setFiles={setFiles}
                    className="w-full overflow-y-scroll no-scrollbar max-h-[25dvh]"
                    fileExtension="pdf"
                />
            </CardContent>
            <CardFooter className="justify-end">
                <Button
                    onClick={() => handleSave()}
                    disabled={files.length === 0}
                >
                    Upload{" "}
                    {files.length > 0 ? `${files.length} files` : ""}
                </Button>
            </CardFooter>
        </Card>
    )
}

export default FileUpload
