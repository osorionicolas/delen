import copy from "copy-to-clipboard"
import { Files } from "lucide-react"
import { Button } from "./ui/button"
import { useToast } from "@/components/ui/use-toast"

const CopyButton = ({ text }: { text: string }) => {
    const { toast } = useToast()

    const onCopy = (event) => {
        event.stopPropagation()
        copy(extractContent(text))
        toast({
            description: "Text copied to clipboard!",
            variant: "success",
        })
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
