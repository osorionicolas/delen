import { ChevronDown, ChevronUp, Folder } from "lucide-react"
import { Button } from "../ui/button"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "../ui/collapsible"
import { useState } from "react"
import FileWrapper from "./file-wrapper"
import { File, FileType } from "@/lib/definitions"

type FolderWrapperProperties = {
    file: any
    checked: any[]
    handleToggle: (file) => void
    isRoot: boolean
}

const FolderWrapper = ({
    file,
    checked,
    handleToggle,
    isRoot,
}: FolderWrapperProperties) => {
    const [openFolder, setOpenFolder] = useState(false)

    const filename = file.name

    return (
        <Collapsible open={openFolder} key={filename}>
            <CollapsibleTrigger asChild>
                <li
                    key={filename}
                    className={`cursor-pointer flex justify-between hover:bg-zinc-500 py-1 pr-1 ${
                        isRoot ? "" : "pl-4"
                    }`}
                    onClick={() => setOpenFolder(!openFolder)}
                >
                    <div className="flex items-center gap-5">
                        <Folder size={18} />
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
            <CollapsibleContent className={`CollapsibleContent border-l-2 ${
                        isRoot ? "" : "ml-4"
                    }`}>
                <ul>
                    {file.children.map((child: File) => {
                        const childname = child.name
                        if (
                            child.type === FileType.DIR &&
                            child.children.length > 0
                        ) {
                            return (
                                <FolderWrapper
                                    key={childname}
                                    file={child}
                                    checked={checked}
                                    handleToggle={handleToggle}
                                    isRoot={false}
                                />
                            )
                        } else if (child.type === FileType.FILE) {
                            return (
                                <FileWrapper
                                    key={childname}
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
