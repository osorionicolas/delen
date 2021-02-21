import React, { useState, useEffect } from 'react'
import TextareaAutosize from '@material-ui/core/TextareaAutosize'
import './HomePage.css'
import { SERVER_ADDRESS } from '../../config/environment'
import { withStyles  } from '@material-ui/core/styles'

const styles = () => ({
    dialog: {
        height: "57vh !important",
        margin: "17vh 10vw",
        width: "79vw !important"
    },
})

const HomePage = (props) => {
    const [value, setValue] = useState("")
    const { classes } = props;

    useEffect(() => {
        fetch(`http://${SERVER_ADDRESS}/text`)
            .then(response => response.text())
            .then(data => setValue(data))
    }, [])
    
    const handleChange = (event) => setValue(event.target.value)

    const handleBlur = (event) => {
        const { value } = event.target;
        fetch(`http://${SERVER_ADDRESS}/text`, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: value
        })
        setValue(value)
    }    
    
    return (
        <TextareaAutosize onBlur={handleBlur} className={classes.dialog} id="textArea" rowsMin={30} value={value} onChange={handleChange} />
    )
}

export default withStyles(styles)(HomePage);
