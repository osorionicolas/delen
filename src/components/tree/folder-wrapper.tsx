import { ChevronDown, ChevronUp, Folder, FolderOpen } from "lucide-react"
import { Button } from "../ui/button"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "../ui/collapsible"
import { useEffect, useState } from "react"
import FileWrapper from "./file-wrapper"
import { File, FileType } from "@/lib/definitions"
import { flatFileList } from "@/lib/utils"

type FolderWrapperProperties = {
    file: any
    checked: any[]
    setChecked: (files) => void
    handleToggle: (file) => void
    isRoot: boolean
    selectAllParent?: boolean
}

const FolderWrapper = ({
    file,
    checked,
    setChecked,
    handleToggle,
    isRoot,
    selectAllParent = false,
}: FolderWrapperProperties) => {
    const [openFolder, setOpenFolder] = useState(selectAllParent)
    const [selectAll, setSelectAll] = useState(selectAllParent)

    useEffect(() => {
        setSelectAll(selectAllParent)
    }, [selectAllParent])

    const filename = file.name

    const handleSelectAllFolder = (e) => {
        e.preventDefault()
        e.stopPropagation()

        if (!selectAll) {
            setChecked([...checked, ...flatFileList(file.children)])
            setSelectAll(true)
            setOpenFolder(true)
        } else {
            setChecked((prev) =>
                prev.filter(
                    (item) => !flatFileList(file.children).includes(item)
                )
            )
            setSelectAll(false)
        }
    }
    return (
        <Collapsible open={openFolder} key={filename}>
            <CollapsibleTrigger asChild>
                <li
                    key={filename}
                    className={`cursor-pointer flex justify-between hover:bg-zinc-500 py-1 pr-1 ${
                        !isRoot && "pl-4"
                    }`}
                    onClick={() => setOpenFolder(!openFolder)}
                >
                    <div className="flex items-center gap-5">
                        <Button
                            variant="ghost"
                            className={`px-0 hover:*:fill-blue-500 hover:bg-transparent h-5`}
                            onClick={handleSelectAllFolder}
                        >
                            {openFolder ? (
                                <FolderOpen size={18} />
                            ) : (
                                <Folder size={18} />
                            )}
                        </Button>
                        {filename}
                    </div>
                    <Button
                        variant="ghost"
                        className="hover:bg-color-none hover:text-white px-3"
                    >
                        {openFolder ? <ChevronUp /> : <ChevronDown />}
                    </Button>
                </li>
            </CollapsibleTrigger>
            <CollapsibleContent
                className={`CollapsibleContent border-l-2 ${!isRoot && "ml-4"}`}
            >
                <ul>
                    {file.children.map((child: File) => {
                        const childPath = child.path
                        if (
                            child.type === FileType.DIR &&
                            child.children.length > 0
                        ) {
                            return (
                                <FolderWrapper
                                    key={childPath}
                                    file={child}
                                    checked={checked}
                                    handleToggle={handleToggle}
                                    setChecked={setChecked}
                                    isRoot={false}
                                    selectAllParent={selectAll}
                                />
                            )
                        } else if (child.type === FileType.FILE) {
                            return (
                                <FileWrapper
                                    key={childPath}
                                    file={child}
                                    checked={checked}
                                    handleToggle={handleToggle}
                                    isRoot={false}
                                />
                            )
                        }
                    })}
                </ul>
            </CollapsibleContent>
        </Collapsible>
    )
}

export default FolderWrapper
