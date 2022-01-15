import React, { useState, useContext } from 'react'
import { Collapse, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import { ExpandLess, ExpandMore } from '@material-ui/icons'
import FolderIcon from '@material-ui/icons/Folder'
import TreeItem from './TreeItem'
import { makeStyles } from '@material-ui/core/styles'
import { CheckboxContext } from './providers/CheckboxProvider'

const styles = makeStyles((theme) => ({
    nested: {
        paddingLeft: theme.spacing(2),
    },
}))

const TreeRoot = ({file, secondaryAction, secondaryActionIcon, className}) => {
    const classes = styles()
    const { selectAll, setSelectAll } = useContext(CheckboxContext)
    const [open, setOpen] = useState(false)
    const filename = file.name

    return (
        <>
        <ListItem key={filename} button disableGutters dense onClick={() => setOpen(!open)} className={className}>
            <ListItemIcon>
                <FolderIcon />
            </ListItemIcon>
            <ListItemText primary={filename} />
            {open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit className={className}>
            <List component="div" disablePadding>
            {
                file.children.map(child => {
                    if(child.type === "directory" && child.children.length > 0){
                        return (
                            <TreeRoot file={child} secondaryActionIcon={secondaryActionIcon} secondaryAction={secondaryAction} selectAll={selectAll} className={classes.nested}></TreeRoot>
                        )
                    }
                    else if(child.type === "file") {
                        return (
                            <TreeItem file={child} secondaryActionIcon={secondaryActionIcon} secondaryAction={secondaryAction} selectAll={selectAll} isLeaf={true} className={classes.nested}></TreeItem>
                        )
                    }                    
                })
            }
            </List>
        </Collapse>
        </>
    )
}

export default TreeRoot