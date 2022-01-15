import React, { useEffect, useState, useContext } from 'react'
import { Checkbox, ListItem, ListItemIcon, ListItemText, IconButton, ListItemSecondaryAction } from '@material-ui/core'
import { CheckboxContext } from './providers/CheckboxProvider'

const TreeItem = ({secondaryAction, secondaryActionIcon, file, isLeaf, className}) => {
    const { selectAll, setSelectAll } = useContext(CheckboxContext)
    const [checked, setChecked] = useState(false)
    const childname = file.name

    useEffect(() => {
        setChecked(selectAll)
    }, [selectAll])

    return ( 
        <ListItem key={childname} className={`${isLeaf ? className : ""}`} button disableGutters dense onClick={() => setChecked(!checked)}>
            <ListItemIcon>
                <Checkbox
                    edge="start"
                    checked={checked}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': childname }}
                />
            </ListItemIcon>
            <ListItemText primary={childname} />
            <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="copy" onClick={() => secondaryAction(childname, file.path)}>
                    {secondaryActionIcon}
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    )
}

export default TreeItem