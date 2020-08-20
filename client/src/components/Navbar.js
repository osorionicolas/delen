import React from 'react';
import Toggle from './Toggle';
import { AppBar, Toolbar, Typography, Button, Dialog, DialogTitle, DialogContent, Hidden } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { withStyles  } from '@material-ui/core/styles';
import { DropzoneDialog } from 'material-ui-dropzone';
import GetAppIcon from '@material-ui/icons/GetApp';
import download from 'downloadjs';
import ClearIcon from '@material-ui/icons/Clear';
import { SERVER_ADDRESS } from '../constants';
import Loader from 'react-loader-spinner';

const styles = (theme) => ({
    button: {
        margin: theme.spacing(1),
        justifyContent: "flex-end"
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
    }
});

class Navbar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            openUploads: false,
            openDownloads: false,
            files: [],
            downloadableFiles: [],
            loading: false
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
            fetch(`http://${SERVER_ADDRESS}/files`, {
                method: 'POST',
                body: data
            })
        })
    }
 
    handleOpen(dialog) {
        if(dialog === "upload"){
            this.setState({
                openUploads: true,
            });
        }
        else if(dialog === "download") {
            this.getDownloadableFiles();
        }
    }

    async getDownloadableFiles(){
        const downloadableFiles = await fetch(`http://${SERVER_ADDRESS}/files`)
        .then(response => response.json())
        .then(data => data)
        this.setState({
            openDownloads: true,
            downloadableFiles: downloadableFiles
        });
    }

    async downloadFile(file){
        this.handleLoader(true);
        const res = await fetch(`http://${SERVER_ADDRESS}/files/` + file);
        const blob = await res.blob();
        download(blob, file);
        this.handleLoader(false);
    }

    removeFile(file){
        const response = window.confirm("You are about to delete the file, are you sure you want it?")
        if(response){
            fetch(`http://${SERVER_ADDRESS}/files/` + file, {
                method: 'DELETE'
            }).then(this.getDownloadableFiles())
        }
    }

    copyToClipboard(){
        var copyText = document.getElementById("textArea");
        copyText.select();
        copyText.setSelectionRange(0, 99999);
        document.execCommand("copy");
    }
 
    handleLoader = (boolean) => {
        this.setState({
            ...this.state,
            loading: boolean
        })
    }

    render(){
        const { theme, themeToggler, classes } = this.props;
        const files = this.state.downloadableFiles;
        //TODO Mover el Loader a donde corresponda
        return (
            <div className="flexGrow">
                { (this.state.loading) ? <div className={classes.loaderBackground}><Loader className={classes.loader} type="Puff" color="#00BFFF" height={100} width={100}/></div>  : "" }
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
                            acceptedFiles={["text/*", "image/*", "video/*", "application/*"]}
                            open={this.state.openUploads}
                            onSave={this.handleSave}
                            showPreviews={true}
                            maxFileSize={500000000}
                            onClose={this.handleClose.bind(this, "upload")}
							filesLimit={50}
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
                            <DialogTitle style={{ textAlign: "center"}} id="dialog-title">Uploaded files</DialogTitle>
                            <Typography style={{ textAlign: "right", marginRight: "24px"}} variant="subtitle1" color="inherit" className="flexGrow">There are {files.length} file/s</Typography>
                            <DialogContent dividers>
                                {
                                    files.map(file => (
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
                            <Hidden xsDown>Dark Theme</Hidden>
                        </Button>
                    </div>
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
}

export default withStyles(styles)(Navbar);
