import { ChevronDown, ChevronUp, Folder } from "lucide-react"
import { Button } from "./ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import { useState } from "react"
import FileWrapper from "./file-wrapper"
import { File, FileType } from "@/lib/definitions"

type FolderWrapperProperties = {
    file: any
    checked: any[]
    handleToggle: (file) => void
}

const FolderWrapper = ({
    file,
    checked,
    handleToggle
}: FolderWrapperProperties) => {
    const [openFolder, setOpenFolder] = useState(false)

    const filename = file.name

    return (
        <Collapsible open={openFolder} key={filename}>
            <CollapsibleTrigger asChild>
                <li
                    key={filename}
                    className={
                        "cursor-pointer flex justify-between hover:bg-zinc-500 py-1 pl-4 pr-1"
                    }
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
            <CollapsibleContent
                className="CollapsibleContent border-l-2 ml-4"
            >
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
                                />
                            )
                        } else if (child.type === FileType.FILE) {
                            return (
                                <FileWrapper
                                    key={childname}
                                    file={child}
                                    checked={checked}
                                    handleToggle={handleToggle}
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
