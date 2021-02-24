import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Button, Checkbox, Collapse, Dialog, DialogContent, DialogTitle, FormControlLabel, List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core'
import { ExpandLess, ExpandMore } from '@material-ui/icons'
import download from 'downloadjs'
import CloudDownloadIcon from '@material-ui/icons/CloudDownload'
import DeleteIcon from '@material-ui/icons/Delete'
import FolderIcon from '@material-ui/icons/Folder'
import { SERVER_ADDRESS } from '../config/environment'

const styles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1)
    },

    toEnd: {
        float: "right"
    },
    
    nested: {
        paddingLeft: theme.spacing(4),
    }
}))

const DownloadDialog = ({open, setOpen, setLoading, downloadableFiles, setDownloadableFiles}) => {
    const classes = styles()
    const [checked, setChecked] = useState([])
    const [selectAll, setSelectAll] = useState(false)
    const [openFolder, setOpenFolder] = useState(false)

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
    }, [selectAll])

    useEffect(() => {
        setSelectAll(false)
        setChecked([])
        getDownloadableFiles()
    }, [open])

    return (
        <Dialog fullWidth={true} onClose={() => setOpen(false)} aria-labelledby="dialog-title" open={open}>
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
                                <ListItem key={filename} button disableGutters dense onClick={setOpenFolder(!openFolder)}>
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
    )
}

export default DownloadDialog