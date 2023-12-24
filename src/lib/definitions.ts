export enum FileType {
  FILE = "file",
  DIR = "directory",
}
export type File = {
  name: string
  type: FileType
  children?: File[]
  path: string
}
