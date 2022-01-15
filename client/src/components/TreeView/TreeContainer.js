import React from 'react'
import TreeView from './TreeView'
import { CheckboxProvider } from './providers/CheckboxProvider'

const TreeContainer = ({downloadableFiles, secondaryAction}) => {
    return (
        <CheckboxProvider>
            <TreeView downloadableFiles={downloadableFiles} secondaryAction={secondaryAction}></TreeView>
        </CheckboxProvider>
    )
}

export default TreeContainer