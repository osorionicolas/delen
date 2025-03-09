"use client"
import React, { useState } from "react"
import Autocomplete from "@/components/autocomplete"
import { Button } from "./ui/button"
import { useDownloadableFiles } from "@/hooks/useDownloadableFiles"
import { toast } from "sonner"
import { Dropzone } from "./dropzone"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"

const FileUpload = () => {
    const [path, setPath] = useState<any>(null)
    const [files, setFiles] = useState([])
    const { downloadableFiles, fetchFiles } = useDownloadableFiles()
    const queryClient = useQueryClient()

    // Upload files mutation
    const uploadMutation = useMutation({
        mutationFn: async (filesToUpload: any[]) => {
            const uploadPromises = filesToUpload.map(async (file) => {
                const data = new FormData()
                data.append("file", file)
                let query = ""
                if (path) query = `?path=${path}`

                const response = await fetch(`/api/files${query}`, {
                    method: "POST",
                    body: data,
                })

                if (!response.ok) {
                    throw new Error(`Failed to upload ${file.name}: ${response.statusText}`)
                }

                return response
            })

            return Promise.all(uploadPromises)
        },
        onSuccess: () => {
            toast.success("Files uploaded successfully!")
            setFiles([])
            fetchFiles()
            // Invalidate and refetch files
            queryClient.invalidateQueries({ queryKey: ['downloadableFiles'] })
        },
        onError: (error) => {
            toast.error(`Upload failed: ${error.message}`)
        }
    })

    const handleSave = () => {
        if (files.length > 0) {
            uploadMutation.mutate(files)
        }
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
                    onClick={handleSave}
                    disabled={files.length === 0 || uploadMutation.isPending}
                >
                    {uploadMutation.isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                        </>
                    ) : (
                        <>
                            Upload{" "}
                            {files.length > 0 ? `${files.length} files` : ""}
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    )
}

export default FileUpload