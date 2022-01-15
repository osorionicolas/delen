import React, { createContext, useEffect, useState } from "react"

const CheckboxContext = createContext()

const CheckboxProvider = ({ children }) => { 
    const [selectAll, setSelectAll] = useState(false)
    const [checkedFiles, setCheckedFiles] = useState([])
    const [totalFiles, setTotalFiles] = useState(0)

    useEffect(() => {
        if(totalFiles > 0 && checkedFiles.length === totalFiles) setSelectAll(true)
    }, [checkedFiles])

    return (
        <CheckboxContext.Provider value={{ selectAll, setSelectAll, checkedFiles, setCheckedFiles, totalFiles, setTotalFiles }}>
            {children}
        </CheckboxContext.Provider>
    )
}

export { CheckboxProvider, CheckboxContext }
