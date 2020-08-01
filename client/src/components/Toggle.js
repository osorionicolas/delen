import React from 'react'
import { func, string } from 'prop-types';
import { Switch } from '@material-ui/core';

const Toggle = ({theme,  toggleTheme }) => {
    const isDarkMode = theme === "dark";
    return (
        <Switch
            size="small"
            checked={isDarkMode}
            onChange={toggleTheme}
            name="darkTheme"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
        />
    );
};
Toggle.propTypes = {
    theme: string.isRequired,
    toggleTheme: func.isRequired,
}
export default Toggle;