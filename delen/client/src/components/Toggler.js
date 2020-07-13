import React from 'react'
import { func, string } from 'prop-types';
import { Switch, FormControlLabel } from '@material-ui/core';

const Toggle = ({theme,  toggleTheme }) => {
    const isDarkMode = theme === "dark";
    return (
        <FormControlLabel
            control={
                <Switch
                    size="small"
                    checked={isDarkMode}
                    onChange={toggleTheme}
                    name="darkTheme"
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
            }
            label="Dark Theme"
        />
    );
};
Toggle.propTypes = {
    theme: string.isRequired,
    toggleTheme: func.isRequired,
}
export default Toggle;