import { Checkbox } from "./ui/checkbox"
import CopyButton from "./copy-button"

type FileWrapperProperties = {
    file: any
    checked: any[]
    handleToggle: (file) => void
}

const FileWrapper = ({
    file,
    checked,
    handleToggle,
}: FileWrapperProperties) => {
    const filename = file.name

    return (
        <li
            className={
                "cursor-pointer flex justify-between hover:bg-zinc-500 py-1 pl-4 pr-1"
            }
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
                text={`${window.location.origin}/api/files/${filename}?path=${file.path}`}
            />
        </li>
    )
}

export default FileWrapper
