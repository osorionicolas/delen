import React, { useState, useEffect } from 'react';
import Toggle from './Toggle';
import { AppBar, Toolbar, Typography, Button, Dialog, DialogTitle, DialogContent, Hidden } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { DropzoneDialog } from 'material-ui-dropzone';
import GetAppIcon from '@material-ui/icons/GetApp';
import download from 'downloadjs';
import DeleteIcon from '@material-ui/icons/Delete';
import { SERVER_ADDRESS } from '../config/environment';
import Loader from 'react-loader-spinner';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const styles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1)
    },

    toEnd: {
        float: "right"
    },

    fileName: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        width: "16vh",
        display: "inline-block"
    },

    file: {
        display: "flow-root",
        marginBottom: "10px",
        borderBottom: "groove"
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
    },

    label: {
        marginLeft: "10px"
    }
}))

const Navbar = (props) => {
    const classes = styles()
    const [checked, setChecked] = useState([]);
    const [openUploads, setOpenUploads] = useState(false)
    const [openDownloads, setOpenDownloads] = useState(false)
    const [downloadableFiles, setDownloadableFiles] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectAll, setSelectAll] = useState(false)
    const { theme, themeToggler } = props
 
    const handleSave = (files) => {
        //Saving files to state for further use and closing Modal.
        setOpenUploads(false)
        files.forEach(file => {
            const data = new FormData()
            data.append("file", file)
            fetch(`http://${SERVER_ADDRESS}/files`, {
                method: 'POST',
                body: data
            })
        })
    }

    const getDownloadableFiles = async () => {
        const downloadedFiles = await fetch(`http://${SERVER_ADDRESS}/files`)
            .then(response => response.json())
            .then(data => data)
        setDownloadableFiles(downloadedFiles)
    }

    const downloadFile = async (file) => {
        setLoading(true)
        const res = await fetch(`http://${SERVER_ADDRESS}/files/` + file)
        const blob = await res.blob()
        download(blob, file)
        setLoading(false)
    }

    const removeFiles = (files) => {
        const response = window.confirm("You are about to delete some files, are you sure you want it?")
        if(response) {
            files.forEach(file => {
                fetch(`http://${SERVER_ADDRESS}/files/` + file, {
                    method: 'DELETE'
                }).then(setTimeout(() => getDownloadableFiles(), 500))
            })
            setSelectAll(false)
        }
    }

    const copyToClipboard = () => {
        var copyText = document.getElementById("textArea")
        copyText.select()
        copyText.setSelectionRange(0, 99999)
        document.execCommand("copy")
    }
    
    const handleToggle = (value) => {
        const currentIndex = checked.indexOf(value)
        const newChecked = [...checked]
  
        if(currentIndex === -1) {
            newChecked.push(value)
        }
        else {
            newChecked.splice(currentIndex, 1)
        }
        setSelectAll(false)
        setChecked(newChecked)
    }

    const downloadAll = () => {
        checked.forEach(file => downloadFile(file))
    }

    useEffect(() => {
        setChecked([])
        if(selectAll) {
            setChecked(downloadableFiles)
        }
        else if(checked.length > 0 && checked.length !== downloadableFiles.length) {
            setChecked(checked)
        }
    }, [selectAll, downloadableFiles])

    useEffect(() => {
        setSelectAll(false)
        setChecked([])
        getDownloadableFiles()
    }, [openDownloads])

    //TODO Mover el Loader a donde corresponda
    return (
        <div className="flexGrow">
            { (loading) ? <div className={classes.loaderBackground}><Loader className={classes.loader} type="Puff" color="#00BFFF" height={100} width={100}/></div>  : "" }
            <AppBar position="static">
                <Toolbar variant="dense">
                <Typography variant="h6" color="inherit" className="flexGrow">
                    Delen
                </Typography>
                <div>
                    <Button
                        variant="contained"
                        color="default"
                        className={classes.button}
                        startIcon={<FileCopyIcon />}
                        onClick={copyToClipboard}
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
                    <DropzoneDialog
                        acceptedFiles={["text/*", "image/*", "video/*", "application/*"]}
                        open={openUploads}
                        onSave={handleSave}
                        showPreviews={true}
                        maxFileSize={500000000}
                        onClose={() => setOpenUploads(false)}
                        filesLimit={50}
                    />        
                    <Button
                        variant="contained"
                        color="default"
                        className={classes.button}
                        startIcon={<CloudDownloadIcon />}
                        onClick={() => setOpenDownloads(true)}
                    >
                        <Hidden xsDown>Download</Hidden>
                    </Button>
                    <Dialog fullWidth={true} onClose={() => setOpenDownloads(false)} aria-labelledby="dialog-title" open={openDownloads}>
                        <DialogTitle style={{ textAlign: "center"}} id="dialog-title">Uploaded files</DialogTitle>
                        <div style={{display: "flex", marginLeft: "38px"}}>
                            <FormControlLabel
                                control={<Checkbox checked={selectAll} onChange={() => setSelectAll(!selectAll)} name="checkedA" />}
                                label="Select all"
                                classes={{label: "label"}}
                            />
                            <Typography style={{ textAlign: "right", marginRight: "28px", alignSelf: "center"}} variant="subtitle1" color="inherit" className="flexGrow">There are {downloadableFiles.length} file/s</Typography>
                        </div>
                        <DialogContent dividers>
                            <List>
                            {
                                downloadableFiles.map(file => (
                                    <ListItem key={file}dense button onClick={() => handleToggle(file)}>
                                        <ListItemIcon>
                                            <Checkbox
                                                edge="start"
                                                checked={checked.indexOf(file) !== -1}
                                                tabIndex={-1}
                                                disableRipple
                                                inputProps={{ 'aria-labelledby': file }}
                                            />
                                        </ListItemIcon>
                                        <ListItemText id={file} primary={file} style={{maxWidth: "65%"}} />
                                        <ListItemSecondaryAction>
                                            <Button
                                                startIcon={<GetAppIcon />}
                                                onClick={() => downloadFile(file)}
                                            ></Button>
                                            <Button
                                                startIcon={<DeleteIcon />}
                                                onClick={() => removeFiles([file])}
                                            ></Button>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))
                            }
                            </List>
                        </DialogContent>
                        <DialogContent dividers>
                            <div className={classes.toEnd}>
                                <Button
                                    variant="contained"
                                    color="default"
                                    className={classes.button}
                                    startIcon={<CloudDownloadIcon />}
                                    onClick={() => downloadAll()}
                                    disabled={checked.length === 0}
                                >
                                    Download
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    className={classes.button}
                                    startIcon={<DeleteIcon />}
                                    onClick={() => removeFiles(checked)}
                                    disabled={checked.length === 0}
                                >
                                    Delete
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
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