"use client"
import React, { useState } from "react"
import DownloadDialog from "./download-dialog"
import UploadDialog from "./upload-dialog"
import CopyButton from "@/components/copy-button"
import { useText } from "@/hooks/useText"

const Navbar = () => {
    const [loading, setLoading] = useState(false)
    const { text } = useText()

    return (
        <header className="text-white shadow">
            <div className="flex justify-between bg-[#009980] min-h-12 items-center px-6">
                <span className="text-xl py-2 px-3">Delen</span>
                <div className="flex justify-around grow-[0.1]">
                    <CopyButton text={text} />
                    <UploadDialog />
                    <DownloadDialog setLoading={setLoading} />
                </div>
            </div>
            {/*loading && <Progress value={0} className="" />*/}
        </header>
    )
}

export default Navbar
