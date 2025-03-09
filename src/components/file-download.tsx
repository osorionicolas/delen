import React, { useState, useEffect } from "react"
import { saveAs } from "file-saver"
import { DownloadCloud, Trash, Loader2 } from "lucide-react"
import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"
import { File, FileType } from "@/lib/definitions"
import { Separator } from "./ui/separator"
import { useDownloadableFiles } from "@/hooks/useDownloadableFiles"
import { ScrollArea } from "./ui/scroll-area"
import FileWrapper from "./tree/file-wrapper"
import FolderWrapper from "./tree/folder-wrapper"
import { flatFileList } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

const FileDownload = () => {
    const [checked, setChecked] = useState<File[]>([])
    const [selectAll, setSelectAll] = useState(false)
    const queryClient = useQueryClient()
    const { downloadableFiles, fetchFiles } = useDownloadableFiles()

    // Download files mutation
    const downloadMutation = useMutation({
        mutationFn: async (filesToDownload: File[]) => {
            if (filesToDownload.length === 1) {
                const file = filesToDownload[0]
                const res = await fetch(`/api/files/export?path=${file.path}`)
                if (!res.ok) throw new Error('Failed to download file')
                const blob = await res.blob()
                saveAs(blob, file.name)
                return
            } else {
                const res = await fetch("/api/files/export", {
                    method: "POST",
                    body: JSON.stringify({ files: filesToDownload }),
                })
                if (!res.ok) throw new Error('Failed to download files')
                const blob = await res.blob()
                saveAs(blob, "export_" + new Date().getTime() + ".zip")
                return
            }
        },
        onSuccess: () => {
            toast.success(`${checked.length} file(s) downloaded successfully`)
        },
        onError: (error) => {
            toast.error(`Failed to download files: ${error.message}`)
        }
    })

    // Remove files mutation
    const removeMutation = useMutation({
        mutationFn: async (filesToRemove: File[]) => {
            return Promise.all(
                filesToRemove.map(async (file: File) => {
                    const res = await fetch(`/api/files?path=${file.path}`, {
                        method: "DELETE",
                    })
                    if (!res.ok) throw new Error(`Failed to delete ${file.name}`)
                    return file
                })
            )
        },
        onSuccess: () => {
            toast.success(`${checked.length} file(s) deleted successfully`)
            setSelectAll(false)
            setChecked([])
            fetchFiles()
            // Invalidate and refetch files
            queryClient.invalidateQueries({ queryKey: ['downloadableFiles'] })
        },
        onError: (error) => {
            toast.error(`Failed to delete files: ${error.message}`)
        }
    })

    const downloadFiles = async () => {
        if (checked.length > 0) {
            downloadMutation.mutate(checked)
        }
    }

    const removeFiles = async () => {
        const response = window.confirm(
            "You are about to delete some files, are you sure you want it?"
        )
        if (response && checked.length > 0) {
            removeMutation.mutate(checked)
        }
    }

    const handleToggle = (value: File) => {
        const currentIndex = checked.indexOf(value)
        const newChecked = [...checked]
        if (currentIndex === -1) {
            newChecked.push(value)
        } else {
            newChecked.splice(currentIndex, 1)
        }
        setSelectAll(false)
        setChecked(newChecked)
    }

    useEffect(() => {
        setChecked([])
        if (selectAll) {
            setChecked(flatFileList(downloadableFiles))
        } else if (
            checked.length > 0 &&
            checked.length !== flatFileList(downloadableFiles).length
        ) {
            setChecked(checked)
        }
        // eslint-disable-next-line
    }, [selectAll])

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Uploaded files
                </CardTitle>
            </CardHeader>
            <CardContent className="max-w-(--breakpoint-md)">
                <CardDescription className="pb-4">
                    <div className="flex items-center gap-5 text-white">
                        <Checkbox
                            checked={selectAll}
                            onCheckedChange={() => setSelectAll(!selectAll)}
                            name="checkedA"
                        />
                        There are {flatFileList(downloadableFiles).length}{" "}
                        file/s
                    </div>
                </CardDescription>
                <Separator/>
                <CardContent className="p-0 py-4">
                    <ScrollArea className="h-96">
                        <ul>
                            {downloadableFiles.map((file: File) => {
                                const filePath = file.path
                                if (
                                    file.type === FileType.DIR &&
                                    file.children.length > 0
                                ) {
                                    return (
                                        <FolderWrapper
                                            key={filePath}
                                            file={file}
                                            checked={checked}
                                            handleToggle={handleToggle}
                                            setChecked={setChecked}
                                            isRoot={true}
                                        />
                                    )
                                } else if (file.type === FileType.FILE) {
                                    return (
                                        <FileWrapper
                                            key={filePath}
                                            file={file}
                                            checked={checked}
                                            handleToggle={handleToggle}
                                            isRoot={true}
                                        />
                                    )
                                }
                                return null
                            })}
                        </ul>
                    </ScrollArea>
                </CardContent>
                <Separator />
            </CardContent>
            <CardFooter className="justify-end">
                <div className="flex gap-4">
                    <Button
                        variant="destructive"
                        onClick={removeFiles}
                        disabled={checked.length === 0 || removeMutation.isPending || downloadMutation.isPending}
                    >
                        {removeMutation.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Trash className="mr-2" />
                        )}
                        {removeMutation.isPending ? "Deleting..." : "Delete"}
                        {!removeMutation.isPending && checked.length > 0 ? ` ${checked.length} files` : ""}
                    </Button>
                    <Button
                        onClick={downloadFiles}
                        disabled={checked.length === 0 || downloadMutation.isPending || removeMutation.isPending}
                    >
                        {downloadMutation.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <DownloadCloud className="mr-2" />
                        )}
                        {downloadMutation.isPending ? "Downloading..." : "Download"}
                        {!downloadMutation.isPending && checked.length > 0 ? ` ${checked.length} files` : ""}
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}

export default FileDownload