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

    const getFolders = (files: File[]) =>
        files
            .map((file: File) => (file.type === FileType.DIR ? file : null))
            .filter(Boolean)
            .map((file: any) => ({
                inputValue: file.name,
                label: file.name,
            }))

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
                              (file) => file.inputValue === value
                          )?.label
                        : "Destination folder"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Destination folder" />
                    <CommandEmpty>{`Create folder "${value}"`}</CommandEmpty>
                    <CommandGroup>
                        {getFolders(downloadableFiles).map((file) => (
                            <CommandItem
                                key={file.inputValue}
                                value={file.inputValue}
                                onSelect={(currentValue) => {
                                    setValue(
                                        currentValue === value
                                            ? ""
                                            : currentValue
                                    )
                                    setOpen(false)
                                    setPath(currentValue)
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === file.inputValue
                                            ? "opacity-100"
                                            : "opacity-0"
                                    )}
                                />
                                {file.label}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export default Autocomplete