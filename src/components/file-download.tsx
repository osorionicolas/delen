import React, { useState, useEffect } from "react"
import { saveAs } from "file-saver"
import { DownloadCloud, Trash } from "lucide-react"
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

const FileDownload = () => {
    const [checked, setChecked] = useState<File[]>([])
    const [selectAll, setSelectAll] = useState(false)
    const { downloadableFiles, setDownloadableFiles, fetchFiles } =
        useDownloadableFiles()

    const downloadFiles = async () => {
        if (checked.length === 1) {
            checked.forEach(async (file: File) => {
                const res = await fetch(`/api/files/export?path=${file.path}`)
                const blob = await res.blob()
                saveAs(blob, file.name)
            })
        } else {
            const res = await fetch("/api/files/export", {
                method: "POST",
                body: JSON.stringify({ files: checked }),
            })
            const blob = await res.blob()
            saveAs(blob, "export_" + new Date().getTime() + ".zip")
        }
    }

    const removeFiles = async (files: File[]) => {
        const response = window.confirm(
            "You are about to delete some files, are you sure you want it?"
        )
        if (response) {
            await Promise.resolve(
                files.forEach(async (file: File) => {
                    await fetch(`/api/files?path=${file.path}`, {
                        method: "DELETE",
                    })
                })
            ).then((_) => setTimeout(() => {
                setSelectAll(false)
                setChecked([])
                getFiles()
            }, 500))
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

    const getFiles = async () => {
        const files = await fetchFiles()
        setDownloadableFiles(files)
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
            <CardContent className="max-w-screen-md">
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
                <CardContent className="p-4">
                    <ScrollArea className="max-h-96">
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
                        onClick={() => removeFiles(checked)}
                        disabled={checked && checked.length === 0}
                    >
                        <Trash className="mr-2" />
                        Delete{" "}
                        {checked.length > 0
                            ? `${checked.length} files`
                            : ""}
                    </Button>
                    <Button
                        onClick={downloadFiles}
                        disabled={checked.length === 0}
                    >
                        <DownloadCloud className="mr-2" />
                        Download{" "}
                        {checked.length > 0
                            ? `${checked.length} files`
                            : ""}
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}

export default FileDownload
