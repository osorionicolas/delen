import React, { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import {
  Button,
  Checkbox,
  Collapse,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  ListItemSecondaryAction,
} from "@mui/material";
import download from "downloadjs";
import copy from "copy-to-clipboard";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import FolderIcon from "@mui/icons-material/Folder";

const styles = makeStyles((theme) => ({
  button: {
    margin: "8px",
  },

  nested: {
    paddingLeft: "32px",
  },
}));

const DownloadDialog = ({
  open,
  setOpen,
  setLoading,
  downloadableFiles,
  setDownloadableFiles,
}) => {
  const classes = styles();
  const [checked, setChecked] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [openFolder, setOpenFolder] = useState(false);

  const getFiles = (files) =>
    files
      .map((file) => {
        if (file.type === "directory" && file.children.length > 0) {
          return file.children.map((child) => child);
        } else if (file.type === "file") {
          return file;
        }
        return null;
      })
      .filter(Boolean)
      .flat();

  const downloadFiles = () => {
    setLoading(true);
    checked.forEach(async (file) => {
      const res = await fetch(`/files/${file.name}?path=${file.path}`);
      const blob = await res.blob();
      download(blob, file.name);
    });
    //Parecería que no funciona
    setLoading(false);
  };

  const removeFiles = (files) => {
    const response = window.confirm(
      "You are about to delete some files, are you sure you want it?"
    );
    if (response) {
      files.forEach((file) => {
        fetch(`/files?path=${file.path}`, {
          method: "DELETE",
        }).then(setTimeout(() => getDownloadableFiles(), 500));
      });
      setSelectAll(false);
      setChecked([]);
    }
  };

  const handleToggle = (value) => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setSelectAll(false);
    setChecked(newChecked);
  };

  const getDownloadableFiles = async () => {
    const files = await fetch(`/files`)
      .then((response) => response.json())
      .then((data) => data);
    setDownloadableFiles(files);
  };

  useEffect(() => {
    setChecked([]);
    if (selectAll) {
      setChecked(getFiles(downloadableFiles));
    } else if (
      checked.length > 0 &&
      checked.length !== getFiles(downloadableFiles).length
    ) {
      setChecked(checked);
    }
    // eslint-disable-next-line
  }, [selectAll]);

  useEffect(() => {
    setSelectAll(false);
    setChecked([]);
    getDownloadableFiles();
    // eslint-disable-next-line
  }, [open]);

  return (
    <Dialog
      fullWidth={true}
      onClose={() => setOpen(false)}
      aria-labelledby="dialog-title"
      open={open}
    >
      <DialogTitle style={{ textAlign: "center" }} id="dialog-title">
        Uploaded files
      </DialogTitle>
      <div style={{ display: "flex", marginLeft: "12px" }}>
        <Checkbox
          checked={selectAll}
          onChange={() => setSelectAll(!selectAll)}
          name="checkedA"
        />
        <Typography
          style={{
            textAlign: "right",
            marginRight: "28px",
            alignSelf: "center",
          }}
          variant="subtitle1"
          color="inherit"
          className="flexGrow"
        >
          There are {getFiles(downloadableFiles).length} file/s
        </Typography>
      </div>
      <DialogContent dividers>
        <List>
          {downloadableFiles.map((file) => {
            const filename = file.name;
            if (file.type === "directory" && file.children.length > 0) {
              return (
                <>
                  <ListItem
                    key={filename}
                    button
                    disableGutters
                    dense
                    onClick={() => setOpenFolder(!openFolder)}
                  >
                    <ListItemIcon>
                      <FolderIcon />
                    </ListItemIcon>
                    <ListItemText primary={filename} />
                    {openFolder ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse in={openFolder} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {file.children.map((child) => {
                        const childname = child.name;
                        return (
                          <ListItem
                            key={childname}
                            className={classes.nested}
                            button
                            disableGutters
                            dense
                            onClick={() => handleToggle(child)}
                          >
                            <ListItemIcon>
                              <Checkbox
                                edge="start"
                                checked={checked.indexOf(child) !== -1}
                                tabIndex={-1}
                                disableRipple
                                inputProps={{ "aria-labelledby": childname }}
                              />
                            </ListItemIcon>
                            <ListItemText primary={childname} />
                            <ListItemSecondaryAction>
                              <IconButton
                                edge="end"
                                aria-label="copy"
                                onClick={() =>
                                  copy(`/files/${filename}?path=${file.path}`)
                                }
                              >
                                <FileCopyIcon />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        );
                      })}
                    </List>
                  </Collapse>
                </>
              );
            } else if (file.type === "file") {
              return (
                <ListItem
                  key={filename}
                  dense
                  button
                  disableGutters
                  onClick={() => handleToggle(file)}
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={checked.indexOf(file) !== -1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ "aria-labelledby": filename }}
                    />
                  </ListItemIcon>
                  <ListItemText primary={filename} />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="copy"
                      onClick={() =>
                        copy(`/files/${filename}?path=${file.path}`)
                      }
                    >
                      <FileCopyIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            }
            return null;
          })}
        </List>
      </DialogContent>
      <Grid container justifyContent="flex-end">
        <Grid item>
          <Button
            variant="contained"
            className={classes.button}
            startIcon={<CloudDownloadIcon />}
            onClick={() => downloadFiles()}
            disabled={checked.length === 0}
          >
            Download
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="error"
            className={classes.button}
            startIcon={<DeleteIcon />}
            onClick={() => removeFiles(checked)}
            disabled={checked.length === 0}
          >
            Delete
          </Button>
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default DownloadDialog;
