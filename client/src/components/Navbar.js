import React, { useState } from 'react'
import Toggle from './Toggle'
import { AppBar, Toolbar, Typography, Button, Hidden } from '@material-ui/core'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import CloudDownloadIcon from '@material-ui/icons/CloudDownload'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import { makeStyles } from '@material-ui/core/styles'
import DownloadDialog from './DownloadDialog'
import UploadDialog from './UploadDialog'
import Loader from 'react-loader-spinner'
import copy from 'copy-to-clipboard'

const styles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1)
    },
    
    loader: {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)"
    },

    loaderBackground: {
        background: "black",
        height: "100%",
        width: "100%",
        position: "absolute",
        zIndex: 9999,
        opacity: 0.7
    }
}))

const Navbar = (props) => {
    const classes = styles()
    const [openUploads, setOpenUploads] = useState(false)
    const [openDownloads, setOpenDownloads] = useState(false)
    const [downloadableFiles, setDownloadableFiles] = useState([])
    const [loading, setLoading] = useState(false)

    const { theme, themeToggler } = props

    return (
        <div className="flexGrow">
            { loading && <div className={classes.loaderBackground}><Loader className={classes.loader} type="Puff" color="#00BFFF" height={100} width={100}/></div> }
            <AppBar position="static">
                <Toolbar variant="dense">
                <Hidden xsDown>
                    <Typography variant="h6" color="inherit" className="flexGrow">
                        Delen
                    </Typography>
                </Hidden>
                <div>
                    <Button
                        variant="contained"
                        color="default"
                        className={classes.button}
                        startIcon={<FileCopyIcon />}
                        onClick={() => copy(document.getElementById("textArea").value)}
                    >
                        <Hidden xsDown>Copy</Hidden>
                    </Button>
                    <Button
                        variant="contained"
                        color="default"
                        className={classes.button}
                        startIcon={<CloudUploadIcon />}
                        onClick={() => setOpenUploads(true)}
                    >
                        <Hidden xsDown>Upload</Hidden> 
                    </Button>
                    <UploadDialog open={openUploads} setOpen={setOpenUploads} downloadableFiles={downloadableFiles} />
                    <Button
                        variant="contained"
                        color="default"
                        className={classes.button}
                        startIcon={<CloudDownloadIcon />}
                        onClick={() => setOpenDownloads(true)}
                    >
                        <Hidden xsDown>Download</Hidden>
                    </Button>
                    <DownloadDialog open={openDownloads} setOpen={setOpenDownloads} setLoading={setLoading} downloadableFiles={downloadableFiles} setDownloadableFiles={setDownloadableFiles}/>
                    <Button 
                        variant="contained"
                        color="default"
                        className={classes.button}
                        onClick={themeToggler}
                    >
                        <Toggle theme={theme} toggleTheme={themeToggler} />
                        <Hidden xsDown>Dark</Hidden>
                    </Button>
                </div>
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default Navbar