import { useState } from "react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "./ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FileType } from "@/lib/definitions"

type AutocompleteProperties = {
    downloadableFiles: File[]
    setPath: (value) => void
}

const Autocomplete = ({
    downloadableFiles,
    setPath,
}: AutocompleteProperties) => {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")
    const [input, setInput] = useState("")

    const getFolders = (files: File[]) =>
        files
            .map((file: File) => (file.type === FileType.DIR ? file : null))
            .filter(Boolean)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {value
                        ? getFolders(downloadableFiles).find(
                              (file) => file.name === value
                          )?.name
                        : "Destination folder"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput
                        placeholder="Destination folder"
                        onValueChange={setInput}
                    />
                    <CommandEmpty>{`Create folder "${input}"`}</CommandEmpty>
                    <CommandGroup>
                        {getFolders(downloadableFiles).map((file) => (
                            <CommandItem
                                key={file.name}
                                value={file.name}
                                onSelect={(currentValue) => {
                                    setValue(
                                        currentValue === value
                                            ? ""
                                            : currentValue
                                    )
                                    setPath(currentValue)
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === file.name
                                            ? "opacity-100"
                                            : "opacity-0"
                                    )}
                                />
                                {file.name}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export default Autocomplete