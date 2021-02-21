import React from 'react'
import { Switch } from '@material-ui/core'

const Toggle = ({theme,  toggleTheme }) => {
    const isDarkMode = theme === "dark"
    return (
        <Switch
            size="small"
            checked={isDarkMode}
            onChange={toggleTheme}
            name="darkTheme"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
        />
    )
}

export default Toggle