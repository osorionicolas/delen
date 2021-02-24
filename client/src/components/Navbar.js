import React, { useState, useEffect } from 'react'
import Toggle from './Toggle'
import { AppBar, Toolbar, Typography, Button, Dialog, DialogTitle, DialogContent, Hidden, List, ListItem, ListItemText, ListItemIcon, Collapse, TextField, Snackbar } from '@material-ui/core'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import CloudDownloadIcon from '@material-ui/icons/CloudDownload'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import { DropzoneAreaBase } from 'material-ui-dropzone'
import download from 'downloadjs'
import DeleteIcon from '@material-ui/icons/Delete'
import { SERVER_ADDRESS } from '../config/environment'
import Loader from 'react-loader-spinner'
import Checkbox from '@material-ui/core/Checkbox'
import { makeStyles } from '@material-ui/core/styles'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { ExpandLess, ExpandMore } from '@material-ui/icons'
import FolderIcon from '@material-ui/icons/Folder'
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete'
import { Alert } from '@material-ui/lab'

const styles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1)
    },

    toEnd: {
        float: "right"
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
    
    nested: {
        paddingLeft: theme.spacing(4),
    },
}))

const Navbar = (props) => {
    const classes = styles()
    const [checked, setChecked] = useState([])
    const [openUploads, setOpenUploads] = useState(false)
    const [openDownloads, setOpenDownloads] = useState(false)
    const [downloadableFiles, setDownloadableFiles] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectAll, setSelectAll] = useState(false)
    const [open, setOpen] = useState(false)
    const [files, setFiles] = useState([])
    const [path, setPath] = useState(null)
    const [uploadFileAlert, setUploadFileAlert] = useState(false)

    const { theme, themeToggler } = props

    const filter = createFilterOptions()
 
    const handleSave = () => {
        files.forEach(file => {
            const data = new FormData()
            data.append("file", file.file)
            let query = ""
            if(path) query = `?path=${path.inputValue}`
            fetch(`http://${SERVER_ADDRESS}/files${query}`, {
                method: 'POST',
                body: data
            })
        })
        setUploadFileAlert(true)
        setOpenUploads(false)
        setPath(null)
    }

    const handleClick = () => setOpen(!open)

    const getDownloadableFiles = async () => {
        const files = await fetch(`http://${SERVER_ADDRESS}/files`)
            .then(response => response.json())
            .then(data => data)
        setDownloadableFiles(files)
    }

    const getFiles = (files) => {
        const downloadedFiles = files.map(file => {
            if(file.type === "directory" && file.children.length > 0) {
                return file.children.map(child => child)
            }
            else if(file.type === "file") {
                return file
            }
            return null
        }).filter(Boolean)
        return downloadedFiles.flat()
    }

    const getFolders = (files) =>
        files.map(file => (file.type === "directory") ? file : null)
             .filter(Boolean)
             .map(file => ({inputValue: file.name, label: file.name}))

    const downloadFiles = () => {
        setLoading(true)
        checked.forEach(async file => {
            const res = await fetch(`http://${SERVER_ADDRESS}/files/${file.name}?path=${file.path}`)
            const blob = await res.blob()
            download(blob, file.name)
        })
        setLoading(false)
    }

    const removeFiles = (files) => {
        const response = window.confirm("You are about to delete some files, are you sure you want it?")
        if(response) {
            files.forEach(file => {
                fetch(`http://${SERVER_ADDRESS}/files?path=${file.path}`, {
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

    useEffect(() => {
        setChecked([])
        if(selectAll) {
            setChecked(getFiles(downloadableFiles))
        }
        else if(checked.length > 0 && checked.length !== getFiles(downloadableFiles).length) {
            setChecked(checked)
        }
    // eslint-disable-next-line
    }, [selectAll, downloadableFiles])

    useEffect(() => {
        setSelectAll(false)
        setChecked([])
        getDownloadableFiles()
    }, [openDownloads])

    useEffect(() => setFiles([]), [openUploads])

    //TODO Mover el Loader a donde corresponda
    return (
        <div className="flexGrow">
            { (loading) ? <div className={classes.loaderBackground}><Loader className={classes.loader} type="Puff" color="#00BFFF" height={100} width={100}/></div>  : "" }
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
                    <Dialog fullWidth={true} onClose={() => setOpenUploads(false)} aria-labelledby="dialog-title" open={openUploads}>
                        <DialogTitle style={{ textAlign: "center"}} id="dialog-title">Upload files</DialogTitle>
                            <div style={{display: "flex", marginLeft: "23px"}}>
                            <Autocomplete
                                value={path}
                                onChange={(event, newValue) => setPath(newValue)}
                                filterOptions={(options, params) => {
                                    const filtered = filter(options, params)
                                    if (params.inputValue !== '') {
                                        filtered.push({
                                            inputValue: params.inputValue,
                                            label: `Create folder "${params.inputValue}"`,
                                        })
                                    }
                                    return filtered;
                                }}
                                id="destination-folder"
                                options={getFolders(downloadableFiles)}
                                getOptionLabel={(option) => (option.inputValue) ? option.inputValue : option.label}
                                selectOnFocus
                                clearOnBlur
                                handleHomeEndKeys
                                renderOption={(option) => option.label}
                                style={{ width: 300 }}
                                freeSolo
                                renderInput={(params) => (
                                    <TextField {...params} size="small" label="Destination folder" variant="outlined" />
                                )}
                            />
                            </div>
                            <DialogContent dividers>
                                <DropzoneAreaBase
                                    acceptedFiles={["text/*", "image/*", "video/*", "application/*"]}
                                    maxFileSize={500000000}
                                    filesLimit={50}
                                    useChipsForPreview
                                    previewGridProps={{container: { spacing: 1, direction: 'row' }}}
                                    showAlerts={['error', 'info']}
                                    dropzoneText={files.length === 0 ? "Drag and drop a file here or click" : ""}
                                    fileObjects={files}
                                    onAdd={newFiles => setFiles(prev => prev.concat(newFiles))}
                                    onDelete={fileDeleted => setFiles(prev => prev.filter(file => file !== fileDeleted))}
                                />
                            </DialogContent>
                            <DialogContent dividers>
                            <div className={classes.toEnd}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    className={classes.button}
                                    onClick={() => setOpenUploads(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    className={classes.button}
                                    onClick={() => handleSave()}
                                    disabled={files.length === 0}
                                >
                                    Submit
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                    <Snackbar open={uploadFileAlert} autoHideDuration={6000} onClose={() => setUploadFileAlert(false)}>
                        <Alert onClose={() => setUploadFileAlert(false)} severity="success">
                            Files uploaded successfully!
                        </Alert>
                    </Snackbar>
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
                        <div style={{display: "flex", marginLeft: "23px"}}>
                            <FormControlLabel
                                control={<Checkbox checked={selectAll} onChange={() => setSelectAll(!selectAll)} name="checkedA" />}
                                classes={{label: "label"}}
                            />
                            <Typography style={{ textAlign: "right", marginRight: "28px", alignSelf: "center"}} variant="subtitle1" color="inherit" className="flexGrow">There are {getFiles(downloadableFiles).length} file/s</Typography>
                        </div>
                        <DialogContent dividers>
                            <List>
                            {
                                downloadableFiles.map(file => {
                                    const filename = file.name
                                    if(file.type === "directory" && file.children.length > 0){
                                        return (
                                            <>
                                            <ListItem key={filename} button disableGutters dense onClick={handleClick}>
                                                <ListItemIcon>
                                                    <FolderIcon />
                                                </ListItemIcon>
                                                <ListItemText primary={filename} />
                                                {open ? <ExpandLess /> : <ExpandMore />}
                                            </ListItem>
                                            <Collapse in={open} timeout="auto" unmountOnExit>
                                                <List component="div" disablePadding>
                                                {
                                                    file.children.map(child => {
                                                        const childname = child.name
                                                        return ( 
                                                            <ListItem key={childname} className={classes.nested} button disableGutters dense onClick={() => handleToggle(child)}>
                                                                <ListItemIcon>
                                                                    <Checkbox
                                                                        edge="start"
                                                                        checked={checked.indexOf(child) !== -1}
                                                                        tabIndex={-1}
                                                                        disableRipple
                                                                        inputProps={{ 'aria-labelledby': childname }}
                                                                    />
                                                                </ListItemIcon>
                                                                <ListItemText primary={childname} />
                                                            </ListItem>
                                                        )
                                                    })
                                                }
                                                </List>
                                            </Collapse>
                                            </>
                                        )
                                    }
                                    else if(file.type === "file") {
                                        return (
                                            <ListItem key={filename} dense button disableGutters onClick={() => handleToggle(file)}>
                                                <ListItemIcon>
                                                    <Checkbox
                                                        edge="start"
                                                        checked={checked.indexOf(file) !== -1}
                                                        tabIndex={-1}
                                                        disableRipple
                                                        inputProps={{ 'aria-labelledby': filename }}
                                                    />
                                                </ListItemIcon>
                                                <ListItemText id={filename} primary={filename} />
                                            </ListItem>
                                            )
                                    }
                                    return null
                                })
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
                                    onClick={() => downloadFiles()}
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