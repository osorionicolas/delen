import React, { useState, useEffect } from "react"
import download from "downloadjs"
import { DownloadCloud, Trash } from "lucide-react"
import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"
import { File, FileType } from "@/lib/definitions"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog"
import { Separator } from "./ui/separator"
import { useDownloadableFiles } from "@/hooks/useDownloadableFiles"
import { ScrollArea } from "./ui/scroll-area"
import FileWrapper from "./tree/file-wrapper"
import FolderWrapper from "./tree/folder-wrapper"

const DownloadDialog = ({ setLoading }: any) => {
    const [checked, setChecked] = useState([])
    const [selectAll, setSelectAll] = useState(false)
    const { downloadableFiles, setDownloadableFiles } = useDownloadableFiles()

    const getFiles = (files: any) =>
        files
            .map((file: File) => {
                if (file.type === FileType.DIR && file.children.length > 0) {
                    return file.children.map((child: File) => child)
                } else if (file.type === FileType.FILE) {
                    return file
                }
                return null
            })
            .filter(Boolean)
            .flat()

    const downloadFiles = () => {
        setLoading(true)
        checked.forEach(async (file: File) => {
            const res = await fetch(`/api/files/${file.name}?path=${file.path}`)
            const blob = await res.blob()
            download(blob, file.name)
        })
        //Parecería que no funciona
        setLoading(false)
    }

    const removeFiles = (files: File[]) => {
        const response = window.confirm(
            "You are about to delete some files, are you sure you want it?"
        )
        if (response) {
            files.forEach((file: File) => {
                fetch(`/api/files?path=${file.path}`, {
                    method: "DELETE",
                }).then((_) => setTimeout(() => getDownloadableFiles(), 500))
            })
            setSelectAll(false)
            setChecked([])
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

    const getDownloadableFiles = async () => {
        const files = await fetch(`/api/files`)
            .then((response) => response.json())
            .then((data) => data)
        setDownloadableFiles(files)
    }

    useEffect(() => {
        setChecked([])
        if (selectAll) {
            setChecked(getFiles(downloadableFiles))
        } else if (
            checked.length > 0 &&
            checked.length !== getFiles(downloadableFiles).length
        ) {
            setChecked(checked)
        }
        // eslint-disable-next-line
    }, [selectAll])

    const setOpen = () => {
        setSelectAll(false)
        setChecked([])
        getDownloadableFiles()
    }

    return (
        <Dialog onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" color="inherit">
                    <DownloadCloud />
                </Button>
            </DialogTrigger>
            <DialogContent className="border-transparent max-w-screen-md">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        Uploaded files
                    </DialogTitle>
                    <DialogDescription>
                        <div className="flex items-center gap-5 text-white">
                            <Checkbox
                                checked={selectAll}
                                onCheckedChange={() => setSelectAll(!selectAll)}
                                name="checkedA"
                            />
                            There are {getFiles(downloadableFiles).length}{" "}
                            file/s
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <Separator />
                <ScrollArea className="max-h-96">
                    <ul>
                        {downloadableFiles.map((file: any) => {
                            const filename = file.name
                            if (
                                file.type === FileType.DIR &&
                                file.children.length > 0
                            ) {
                                return (
                                    <FolderWrapper
                                        key={filename}
                                        file={file}
                                        checked={checked}
                                        handleToggle={handleToggle}
                                        isRoot={true}
                                    />
                                )
                            } else if (file.type === FileType.FILE) {
                                return (
                                    <FileWrapper
                                        key={filename}
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
                <Separator />
                <DialogFooter>
                    <div className="flex justify-end items-center gap-4">
                        <Button
                            variant="destructive"
                            onClick={() => removeFiles(checked)}
                            disabled={checked.length === 0}
                        >
                            <Trash className="mr-2" />
                            Delete{" "}
                            {checked.length > 0
                                ? `${checked.length} files`
                                : ""}
                        </Button>
                        <Button
                            onClick={() => downloadFiles()}
                            disabled={checked.length === 0}
                        >
                            <DownloadCloud className="mr-2" />
                            Download{" "}
                            {checked.length > 0
                                ? `${checked.length} files`
                                : ""}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DownloadDialog
