'use client'

import { createContext, useContext, useEffect, useState } from "react"
import { File } from "@/lib/definitions"

type DownloadableFilesContext = {
    downloadableFiles: File[]
    setDownloadableFiles: React.Dispatch<React.SetStateAction<File[]>>
    fetchFiles: Function
}

const DownloadableFilesContext = createContext<DownloadableFilesContext>(null)

export const DownloadableFilesProvider = ({ children }: any) => {
  const [downloadableFiles, setDownloadableFiles] = useState<File[]>([])

  const fetchFiles = async () => {
    const files = await fetch("/api/files")
      .then((response) => response.json())
      .then((data) => data);
    return files
  }

  useEffect(() => {
    fetchFiles().then((files) => setDownloadableFiles(files))
  }, [])

  return (
    <DownloadableFilesContext.Provider
      value={{ downloadableFiles, setDownloadableFiles, fetchFiles }}
    >
      {children}
    </DownloadableFilesContext.Provider>
  );
}

export const useDownloadableFiles = () => {
  return useContext(DownloadableFilesContext);
};