import React, { useState, useEffect, useContext } from 'react'
import { Checkbox, List, Typography, Grid } from '@material-ui/core'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import TreeItem from './TreeItem'
import TreeRoot from './TreeRoot'
import { makeStyles } from '@material-ui/core/styles'
import { CheckboxContext } from './providers/CheckboxProvider'

const styles = makeStyles((theme) => ({
    checkbox: {
        paddingLeft: 0,
    },
}))


const TreeView = ({downloadableFiles, secondaryAction}) => {
    const { selectAll, setSelectAll } = useContext(CheckboxContext)
    const classes = styles()
    const [checked, setChecked] = useState([])

    const getFiles = (files) => files.map(file => {
        if(file.type === "directory" && file.children.length > 0) {
            return file.children ? getFiles(file.children) : file.children.map(child => child)
        }
        else if(file.type === "file") {
            return file
        }
        return null
    }).filter(Boolean).flat()

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

    return (
        <>
        <Grid container alignItems="center">
            <Checkbox className={classes.checkbox} checked={selectAll} onChange={() => setSelectAll(!selectAll)} name="checkedA" />
            <Typography style={{ marginRight: "8px"}} align="right" variant="subtitle1" className="flexGrow">There are {getFiles(downloadableFiles).length} file/s</Typography>
        </Grid>
        <List>
        {
            downloadableFiles.map(file => {
                if(file.type === "directory" && file.children.length > 0){
                    return (
                        <TreeRoot file={file} secondaryActionIcon={<FileCopyIcon />} secondaryAction={secondaryAction} selectAll={selectAll} ></TreeRoot>
                    )
                }
                else if(file.type === "file") {
                    return (
                        <TreeItem file={file} secondaryActionIcon={<FileCopyIcon />} secondaryAction={secondaryAction} selectAll={selectAll} isLeaf={false}></TreeItem>
                    )
                }
                return null
            })
        }
        </List>
        </>
    )
}

export default TreeView