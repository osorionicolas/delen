import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Button, Dialog, DialogContent, DialogTitle, Snackbar, TextField } from '@material-ui/core'
import { Alert, Autocomplete, createFilterOptions } from '@material-ui/lab'
import { DropzoneAreaBase } from 'material-ui-dropzone'
import { SERVER_ADDRESS } from '../config/environment'

const styles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1)
    },

    toEnd: {
        float: "right"
    }
}))

const UploadDialog = ({open, setOpen, downloadableFiles}) => {
    const classes = styles()
    const [path, setPath] = useState(null)
    const [files, setFiles] = useState([])
    const [uploadFileAlert, setUploadFileAlert] = useState(false)

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
        setOpen(false)
        setPath(null)
    }

    const getFolders = (files) =>
        files.map(file => (file.type === "directory") ? file : null)
             .filter(Boolean)
             .map(file => ({inputValue: file.name, label: file.name}))

    useEffect(() => setFiles([]), [open])

    return (
        <>
        <Dialog fullWidth={true} onClose={() => setOpen(false)} aria-labelledby="dialog-title" open={open}>
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
                        onClick={() => setOpen(false)}
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
        </>
    )
}

export default UploadDialog