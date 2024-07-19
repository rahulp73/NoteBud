import { useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import PrivateRoutes from './PrivateRoutes'
import ProtectedRoutes from './ProtectedRoutes'
import getAuthToken from './utils/getAuthToken';
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import { CssBaseline, useMediaQuery } from '@mui/material';
import SignUp from './pages/SignUp';
import Notes from './pages/Notes'
import Trash from './pages/Trash'
import { useAuth } from './utils/AuthContext';
import axios from 'axios';
import { apiRoot } from './config';

function App() {

  const [authToken, setAuthToken] = useState(Boolean(getAuthToken()))
  const { login } = useAuth();

  useEffect(() => {
    const newToken = async () => {
      const response = await axios.get(`${apiRoot}/newToken`, { withCredentials: true })
      if (response.status === 200) {
        login(response.data.name,response.data.email,response.data.avatar)
      }
    }
    if(Boolean(getAuthToken())){
      newToken()
    }
  }, [])

  const lightTheme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#81af6a', // Light theme primary color
      },
      secondary: {
        main: '#81af6a',
      },
      appBar: {
        main: '#ffffff', // White for light theme
      },
    },
    typography: {
      "fontFamily": `"Poppins", "Roboto", "Arial" ,"Helvetica", sans-serif`,
      "fontSize": 13,
      "fontWeightLight": 300,
      "fontWeightRegular": 400,
      "fontWeightMedium": 500
    }
  });

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#228B22', // Dark theme primary color
      },
      secondary: {
        main: '#228B22',
      },
      appBar: {
        main: '#000000', // Black for dark theme
      },
    },
    typography: {
      "fontFamily": `"Roboto", "Arial" ,"Helvetica", sans-serif`,
      "fontWeightLight": 300,
      "fontWeightRegular": 400,
      "fontWeightMedium": 500
    }
  });

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = prefersDarkMode ? darkTheme : lightTheme;

  return (
    <>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route element={<ProtectedRoutes authToken={authToken} />}>
              <Route path="/signin" element={<SignIn setAuthToken={setAuthToken} />} />
              <Route path="/signup" element={<SignUp setAuthToken={setAuthToken} />} />
            </Route>
            <Route element={<PrivateRoutes authToken={authToken} />}>
              <Route path='/' element={<Home setAuthToken={setAuthToken} />} >
                <Route index element={<Navigate to='/notes' />} />
                <Route path='/notes' index element={<Notes />} />
                <Route path='/trash' element={<Trash />} />
              </Route>
            </Route>
            <Route path='*' element={<Navigate to='/' />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </>
  )
}

export default App
