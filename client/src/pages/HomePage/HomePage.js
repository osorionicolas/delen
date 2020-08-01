import React from 'react';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import './HomePage.css';
import { SERVER_ADDRESS } from '../../constants';

class HomePage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            value: "",
        }  
    }

    componentDidMount(){
        fetch(`http://${SERVER_ADDRESS}/text`)
            .then(response => response.text())
            .then(data => 
                this.setState({
                    value: data
                })
            )
    }
    
    handleChange = (event) => {
        const { value } = event.target;
        this.setState({
            value: value
        });
    }


    handleBlur = (event) => {
        const { value } = event.target;
        fetch(`http://${SERVER_ADDRESS}/text`, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: value
        })
        this.setState({
            value: value
        })
    }    

    render() {
        const { theme } = this.props;
        return (
            <TextareaAutosize onBlur={this.handleBlur} className={theme} id="textArea" rowsMin={30} value={this.state.value} onChange={this.handleChange} />
        )
    }
}

export default HomePage;
