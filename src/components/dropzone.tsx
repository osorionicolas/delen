import React, { useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "./ui/badge"
import { X } from "lucide-react"

interface DropzoneProps {
    setFiles: React.Dispatch<React.SetStateAction<string[]>>
    className?: string
    fileExtension?: string
    files: any[]
}

export function Dropzone({
    setFiles,
    className,
    fileExtension,
    files,
    ...props
}: DropzoneProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null) // Reference to file input element
    //const [error, setError] = useState<string | null>(null) // Error message state

    // Function to handle drag over event
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
    }

    // Function to handle drop event
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        const { files } = e.dataTransfer
        handleFiles(files)
    }

    // Function to handle file input change event
    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target
        if (files) {
            handleFiles(files)
        }
    }

    // Function to handle processing of uploaded files
    const handleFiles = (files: FileList) => {
        // Check file extension
        /*if (fileExtension && !uploadedFile.name.endsWith(`.${fileExtension}`)) {
            setError(`Invalid file type. Expected: .${fileExtension}`)
            return
        }*/

        /*const fileList = Array.from(files).map((file) =>
            URL.createObjectURL(file)
        )*/
        const fileList = Array.from(files)
        setFiles((prevFiles: any[]) => [...prevFiles, ...fileList])

        //setError(null) // Reset error state
    }

    // Function to simulate a click on the file input element
    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    const handleDelete = (e, fileToRemove: string) => {
        e.preventDefault()
        e.stopPropagation()
        setFiles(prev => prev.filter((file: any) => file.name !== fileToRemove))
    }

    return (
        <Card
            className={`border-2 border-dashed bg-muted hover:cursor-pointer hover:border-muted-foreground/50 ${className}`}
            {...props}
        >
            <CardContent
                className="space-y-2 px-2 py-4 text-xs"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={handleButtonClick}
            >
                <div className="flex items-center justify-center text-muted-foreground">
                    <span className="font-medium">
                        Drag Files to Upload or Click Here
                    </span>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="text/*, image/*, video/*, audio/*, application/*"
                        //accept={`.${fileExtension}`} // Set accepted file type
                        onChange={handleFileInputChange}
                        className="hidden"
                        multiple
                    />
                </div>
                {files.map((file) => {
                    const filename = file.name
                    return (
                        <Badge key={filename} className="m-1">
                            {`${filename} (${Math.round(file.size / 1024)} KB)`}
                            <Button
                                className="p-1 h-6 rounded-full ml-2 bg-gray-300"
                                onClick={(e) => handleDelete(e, filename)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </Badge>
                    )
                })}
            </CardContent>
        </Card>
    )
}
