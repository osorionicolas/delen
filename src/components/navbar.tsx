"use client"
import React, { useState } from "react"
import DownloadDialog from "./download-dialog"
import UploadDialog from "./upload-dialog"
import { ProgressBar } from "react-loader-spinner"
import styles from "../styles/Navbar.module.css"
import CopyButton from "@/components/copy-button"
import { useText } from "@/hooks/useText"

const Navbar = () => {
    const [loading, setLoading] = useState(false)
    const { text } = useText()

    return (
        <header className="text-white shadow">
            <nav
                className="flex justify-between bg-[#009980] min-h-12 items-center px-6"
            >
                <span className="text-xl py-2 px-3">Delen</span>
                <div className="flex justify-around grow-[0.1]">
                    <CopyButton text={text} />
                    <UploadDialog />
                    <DownloadDialog setLoading={setLoading} />
                </div>
            </nav>
            {loading && (
                <div className={styles.loaderBackground}>
                    <ProgressBar
                        wrapperClass={styles.loader}
                        barColor="#00BFFF"
                        height={100}
                        width={100}
                    />
                </div>
            )}
        </header>
    )
}

export default Navbar
