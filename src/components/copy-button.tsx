import { Files } from "lucide-react";
import { Button } from "./ui/button"
import { Snackbar, Alert } from "@mui/material";
import { useState } from "react";
import copy from "copy-to-clipboard";

const CopyButton = ({ text }: {text: string}) => {
    const [snackOpen, setSnackOpen] = useState(false)

    const onCopy = (event) => {
        event.stopPropagation()
        copy(extractContent(text))
        setSnackOpen(true)
    }

    const extractContent = (html) => {
        var span = document.createElement("span")
        span.innerHTML = html
        return span.textContent || span.innerText
    }

    return (
        <>
            <Button variant="ghost" onClick={onCopy} className="px-3">
                <Files />
            </Button>
            <Snackbar
                open={snackOpen}
                autoHideDuration={3000}
                onClose={() => setSnackOpen(false)}
            >
                <Alert
                    elevation={6}
                    variant="filled"
                    severity="success"
                    sx={{ width: "100%" }}
                >
                    Text copied to clipboard!
                </Alert>
            </Snackbar>
        </>
    )
}

export default CopyButton