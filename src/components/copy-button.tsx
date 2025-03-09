import copy from "copy-to-clipboard"
import { Files } from "lucide-react"
import { Button } from "./ui/button"
import { toast } from "sonner"

const CopyButton = ({ text }: { text: string }) => {

    const onCopy = (event) => {
        event.stopPropagation()
        copy(extractContent(text))
        toast.success("Text copied to clipboard!")
    }

    const extractContent = (html) => {
        var span = document.createElement("span")
        span.innerHTML = html
        return span.textContent || span.innerText
    }

    return (
        <Button variant="ghost" onClick={onCopy} className="px-3">
            <Files />
        </Button>
    )
}

export default CopyButton
