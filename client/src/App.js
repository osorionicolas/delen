import React from 'react';
import './App.css';
import HomePage from './pages/HomePage/HomePage';
import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "./components/Theme/GlobalStyles";
import { lightTheme, darkTheme } from "./components/Theme/Theme"
import Navbar from './components/Navbar';

class App extends React.Component {
  
  constructor(props) {
    super(props);
    
    const localTheme = window.localStorage.getItem('theme') || "light";
    
    this.state = {
      theme: localTheme
    };

    this.themeToggler = this.themeToggler.bind(this);
  }

  themeToggler(){
    this.state.theme === 'light' ? this.setMode('dark') : this.setMode('light')
  }

  setMode = (mode) => {
    window.localStorage.setItem('theme', mode)
    this.setState({
      theme: mode
    })
  };

  render() {
    const theme = this.state.theme;
    const themeMode = theme === 'light' ? lightTheme : darkTheme;

    return (
      <ThemeProvider theme={themeMode}>
        <GlobalStyles/>
        <Navbar theme={theme} themeToggler={this.themeToggler} />
        <HomePage theme={theme}/>
      </ThemeProvider>
    );
  }
}

export default App;
