"use client"
import React, { useState } from "react"
import Autocomplete from "@/components/autocomplete"
import { Button } from "./ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog"
import { UploadCloud } from "lucide-react"
import { Separator } from "./ui/separator"
import { useDownloadableFiles } from "@/hooks/useDownloadableFiles"
import { toast } from "./ui/use-toast"
import { Dropzone } from "./dropzone"

const UploadDialog = () => {
    const [path, setPath] = useState<any>(null)
    const [files, setFiles] = useState([])
    const { downloadableFiles } = useDownloadableFiles()
    const [open, setOpen] = useState(false)

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
        setOpen(false)
        setPath(null)
    }

    const dialogOpenChange = (state) => {
        setOpen(state)
        setFiles([])
    }

    return (
        <Dialog onOpenChange={dialogOpenChange} open={open}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    color="inherit"
                    onClick={() => setOpen(true)}
                >
                    <UploadCloud />
                </Button>
            </DialogTrigger>
            <DialogContent className="border-transparent max-w-screen-md overflow-y-scroll max-h-dvh">
                <DialogHeader>
                    <DialogTitle className="text-center" id="dialog-title">
                        Upload files
                    </DialogTitle>
                </DialogHeader>
                <Autocomplete
                    downloadableFiles={downloadableFiles}
                    setPath={setPath}
                />
                <Separator />
                <Dropzone
                    files={files}
                    setFiles={setFiles}
                    className="w-full"
                    fileExtension="pdf"
                />
                <Separator />
                <DialogFooter>
                    <div className="flex justify-end items-center gap-4">
                        <DialogClose asChild>
                            <Button type="button" variant="destructive">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            onClick={() => handleSave()}
                            disabled={files.length === 0}
                        >
                            Upload{" "}
                            {files.length > 0 ? `${files.length} files` : ""}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default UploadDialog
