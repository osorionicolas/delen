import React from 'react';
import Toggle from './Toggler';
import { AppBar, Toolbar, Typography, Button, Dialog, DialogTitle, DialogContent, Hidden } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { withStyles  } from '@material-ui/core/styles';
import { DropzoneDialog } from 'material-ui-dropzone';
import GetAppIcon from '@material-ui/icons/GetApp';
import download from 'downloadjs';
import ClearIcon from '@material-ui/icons/Clear';
import { IP } from '../constants';

const styles = (theme) => ({
    button: {
        margin: theme.spacing(1),
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
    }
});

class Navbar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            openUploads: false,
            openDownloads: false,
            files: [],
            downloadableFiles: []
        };

        this.handleSave = this.handleSave.bind(this);
    }

    handleClose(dialog) {
        if(dialog === "upload"){
            this.setState({
                openUploads: false,
            });
        }
        else if(dialog === "download") {
            this.setState({
                openDownloads: false,
            });
        }
    }
 
    handleSave(files) {
        //Saving files to state for further use and closing Modal.
        this.setState({
            files: files,
            openUploads: false
        });
        files.forEach(file => {
            const data = new FormData();
            data.append("file", file);
            fetch(`http://${IP}:5000/files`, {
                method: 'POST',
                body: data
            })
        })
    }
 
    async handleOpen(dialog) {
        if(dialog === "upload"){
            this.setState({
                openUploads: true,
            });
        }
        else if(dialog === "download") {
            const downloadableFiles = await fetch(`http://${IP}:5000/files`)
                .then(response => response.json())
                .then(data => data)
            this.setState({
                openDownloads: true,
                downloadableFiles: downloadableFiles
            });
        }
    }

    async downloadFile(file){
        const res = await fetch(`http://${IP}:5000/files/` + file)
        const blob = await res.blob();
        download(blob, file);
    }

    removeFile(file){
        const response = window.confirm("You are about to delete the file, are you sure you want it?")
        if(response){
            fetch(`http://${IP}:5000/files/` + file, {
                method: 'DELETE'
            })
        }
    }

    copyToClipboard(){
        var copyText = document.getElementById("textArea");
        copyText.select();
        copyText.setSelectionRange(0, 99999);
        document.execCommand("copy");
    }

    render(){
        const { theme, themeToggler, classes } = this.props;
        
        return (
            <div className="flexGrow">
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
                            onClick={this.copyToClipboard}
                        >
                            <Hidden xsDown>Copy</Hidden>
                        </Button>
                        <Button
                            variant="contained"
                            color="default"
                            className={classes.button}
                            startIcon={<CloudUploadIcon />}
                            onClick={this.handleOpen.bind(this, "upload")}
                        >
                            <Hidden xsDown>Upload</Hidden>   
                        </Button>
                        <DropzoneDialog
                            open={this.state.openUploads}
                            onSave={this.handleSave}
                            showPreviews={true}
                            maxFileSize={500000000}
                            onClose={this.handleClose.bind(this, "upload")}
                        />
                        <Button
                            variant="contained"
                            color="default"
                            className={classes.button}
                            startIcon={<CloudDownloadIcon />}
                            onClick={this.handleOpen.bind(this, "download")}
                        >
                            <Hidden xsDown>Download</Hidden>
                        </Button>
                        <Dialog fullWidth={true} onClose={this.handleClose.bind(this, "download")} aria-labelledby="dialog-title" open={this.state.openDownloads}>
                            <DialogTitle style={{ textAlign: "center"}} id="dialog-title">
                            Uploaded files
                            </DialogTitle>
                            <DialogContent dividers>
                                {
                                    this.state.downloadableFiles.map(file => (
                                        <div key={file} className={classes.file}>
                                            <span className={classes.fileName}>{file}</span>
                                            <div style={{float: "right"}}>
                                                <Button
                                                    startIcon={<GetAppIcon />}
                                                    onClick={() => this.downloadFile(file)}
                                                ></Button>
                                                <Button
                                                    startIcon={<ClearIcon />}
                                                    onClick={() => this.removeFile(file)}
                                                ></Button>
                                            </div>
                                        </div>
                                    ))
                                }
                            </DialogContent>
                        </Dialog>
                            <Button 
                                variant="contained"
                                color="default"
                                className={classes.button}
                            >
                            <Toggle theme={theme} toggleTheme={themeToggler} />
                        </Button>
                    </div>
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
}

export default withStyles(styles)(Navbar);
