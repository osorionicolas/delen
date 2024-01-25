import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { FileType, File } from "./definitions"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const flatFileList = (files: File[]) =>
    files
        .map((file: File) => {
            if (file.type === FileType.DIR && file.children.length > 0) {
                return flatFileList(file.children)
            } else if (file.type === FileType.FILE) {
                return file
            }
            return null
        })
        .filter(Boolean)
        .flat()