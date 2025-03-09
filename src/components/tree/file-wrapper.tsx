import { Checkbox } from "../ui/checkbox"
import CopyButton from "../copy-button"

type FileWrapperProperties = {
    file: any
    checked: any[]
    handleToggle: (file) => void
    isRoot: boolean
}

const FileWrapper = ({
    file,
    checked,
    handleToggle,
    isRoot,
}: FileWrapperProperties) => {
    const filename = file.name

    return (
        <li
            className={`cursor-pointer flex items-center justify-between hover:bg-zinc-500 py-1 pl-4 pr-1 ${
                !isRoot && "pl-4"
            }`}
            onClick={() => handleToggle(file)}
        >
            <div className="flex items-center gap-5">
                <Checkbox
                    checked={checked.indexOf(file) !== -1}
                    tabIndex={-1}
                />
                {filename}
            </div>
            <CopyButton
                text={`${window.location.origin}/api/files/export?path=${file.path}`}
            />
        </li>
    )
}

export default FileWrapper
