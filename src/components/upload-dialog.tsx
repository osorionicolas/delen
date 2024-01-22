import React, { useState } from "react"
import {
    TextField,
    createFilterOptions,
    Autocomplete,
} from "@mui/material"
import { DropzoneAreaBase } from "mui-file-dropzone"
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
import { FileType } from "@/lib/definitions"
import { toast } from "./ui/use-toast"

const UploadDialog = () => {
    const [path, setPath] = useState<any>(null)
    const [files, setFiles] = useState([])
    const { downloadableFiles } = useDownloadableFiles()
    const [open, setOpen] = useState(false)

    const filter = createFilterOptions()

    const handleSave = () => {
        files.forEach((file: any) => {
            const data = new FormData()
            data.append("file", file.file)
            let query = ""
            if (path) query = `?path=${path.inputValue}`
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

    const getFolders = (files: File[]) =>
        files
            .map((file: File) => (file.type === FileType.DIR ? file : null))
            .filter(Boolean)
            .map((file: any) => ({ inputValue: file.name, label: file.name }))

    return (
        <Dialog onOpenChange={() => setFiles([])} open={open}>
            <DialogTrigger asChild>
                <Button variant="ghost" color="inherit" onClick={() => setOpen(true)}>
                    <UploadCloud />
                </Button>
            </DialogTrigger>
            <DialogContent className="border-transparent max-w-screen-md">
                <DialogHeader>
                    <DialogTitle className="text-center" id="dialog-title">
                        Upload files
                    </DialogTitle>
                </DialogHeader>
                <Autocomplete
                    disablePortal
                    value={path}
                    onChange={(_, newValue) => setPath(newValue)}
                    filterOptions={(options, params) => {
                        const filtered = filter(options, params)
                        if (
                            params.inputValue !== "" &&
                            !filtered.some(
                                (option: any) =>
                                    option.inputValue === params.inputValue
                            )
                        ) {
                            filtered.push({
                                inputValue: params.inputValue,
                                label: `Create folder "${params.inputValue}"`,
                            })
                        }
                        return filtered
                    }}
                    id="destination-folder"
                    options={getFolders(downloadableFiles)}
                    getOptionLabel={(option) => option.inputValue}
                    selectOnFocus
                    clearOnBlur
                    handleHomeEndKeys
                    renderOption={(props, option) => (
                        <li {...props}>{`${option.label}`}</li>
                    )}
                    sx={{ width: 300 }}
                    freeSolo
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            size="small"
                            label="Destination folder"
                            className="dark"
                        />
                    )}
                />
                <Separator />
                <DropzoneAreaBase
                    dropzoneClass="dark"
                    acceptedFiles={[
                        "text/*",
                        "image/*",
                        "video/*",
                        "application/*",
                    ]}
                    maxFileSize={5000000000}
                    filesLimit={50}
                    useChipsForPreview
                    previewGridProps={{
                        container: { spacing: 1, direction: "row" },
                    }}
                    showAlerts={["error", "info"]}
                    dropzoneText={
                        files.length === 0
                            ? "Drag and drop a file here or click"
                            : ""
                    }
                    fileObjects={files}
                    onAdd={(newFiles: any) =>
                        setFiles((prev) => prev.concat(newFiles))
                    }
                    onDelete={(fileDeleted) =>
                        setFiles((prev) =>
                            prev.filter((file) => file !== fileDeleted)
                        )
                    }
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
                            {files.length > 0
                                ? `${files.length} files`
                                : ""}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default UploadDialog
