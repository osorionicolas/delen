import React, { useState} from 'react';
import './App.css';
import HomePage from './pages/HomePage/HomePage';
import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "./components/Theme/GlobalStyles";
import { lightTheme, darkTheme } from "./components/Theme/Theme"
import Navbar from './components/Navbar';

const App = () => {
  const localTheme = localStorage.theme || "light";
  const [theme, setTheme] = useState(localTheme)
  const themeMode = theme === 'light' ? lightTheme : darkTheme;

  const themeToggler = () => theme === 'light' ? setMode('dark') : setMode('light')

  const setMode = (mode) => {
    localStorage.setItem('theme', mode)
    setTheme(mode)
  }

  return (
    <ThemeProvider theme={themeMode}>
      <GlobalStyles/>
      <Navbar theme={theme} themeToggler={themeToggler} />
      <HomePage />
    </ThemeProvider>
  )
}

export default App
