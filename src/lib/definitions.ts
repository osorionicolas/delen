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

export type Text = {
    id: string;
    content: string;
    created_at: string;
};