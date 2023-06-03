import React, { useState } from "react"
import { AppBar, Toolbar, Typography, Hidden, Box, IconButton, Snackbar, Alert } from "@mui/material"
import DownloadDialog from "./DownloadDialog"
import UploadDialog from "./UploadDialog"
import Loader from "react-loader-spinner"
import copy from "copy-to-clipboard"
import styles from "../styles/Navbar.module.css"
import FileCopyIcon from "@mui/icons-material/FileCopy"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import CloudDownloadIcon from "@mui/icons-material/CloudDownload"

const Navbar = () => {
    const [openUploads, setOpenUploads] = useState(false)
    const [openDownloads, setOpenDownloads] = useState(false)
    const [downloadableFiles, setDownloadableFiles] = useState([])
    const [loading, setLoading] = useState(false)
    const [snackOpen, setSnackOpen] = useState(false)

    const handleCopy = () => {
        copy(document.getElementById("textArea").value)
        setSnackOpen(true)
    }

    return (
        <>
            {loading && (
                <div className={styles.loaderBackground}>
                    <Loader className={styles.loader} type="Puff" color="#00BFFF" height={100} width={100} />
                </div>
            )}
            <AppBar position="static">
                <Toolbar variant="dense" className={styles.navbar}>
                    <Hidden xsDown>
                        <Typography variant="h6" color="inherit" className="flexGrow">
                            Delen
                        </Typography>
                    </Hidden>
                    <Box className={styles.button}>
                        <IconButton color="inherit" onClick={handleCopy}>
                            <FileCopyIcon />
                        </IconButton>
                        <Snackbar open={snackOpen} autoHideDuration={3000} onClose={() => setSnackOpen(false)}>
                            <Alert elevation={6} variant="filled" severity="success" sx={{ width: "100%" }}>
                                Text copied to clipboard!
                            </Alert>
                        </Snackbar>
                        <IconButton color="inherit" onClick={() => setOpenUploads(true)}>
                            <CloudUploadIcon />
                        </IconButton>
                        <UploadDialog
                            open={openUploads}
                            setOpen={setOpenUploads}
                            downloadableFiles={downloadableFiles}
                        />
                        <IconButton color="inherit" onClick={() => setOpenDownloads(true)}>
                            <CloudDownloadIcon />
                        </IconButton>
                        <DownloadDialog
                            open={openDownloads}
                            setOpen={setOpenDownloads}
                            setLoading={setLoading}
                            downloadableFiles={downloadableFiles}
                            setDownloadableFiles={setDownloadableFiles}
                        />
                    </Box>
                </Toolbar>
            </AppBar>
        </>
    )
}

export default Navbar
