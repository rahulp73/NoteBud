import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import pic from '../img/Designer.png'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiRoot } from '../config'
import logo from '../img/logo.png'
import { useAuth } from '../utils/AuthContext';

export default function SignUp({ setAuthToken }) {

  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = React.useState('')
  const [name, setName] = React.useState('')
  const [password, setPassword] = React.useState('')

  const defaultTheme = useTheme()
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${apiRoot}/signup`, { email : email.toLowerCase(),name,password }, { withCredentials: true })
      if (response.status === 201) {
        setAuthToken(true)
        login(response.data.name,response.data.email,response.data.avatar)
      }
    } catch (error) {
      console.log(error)
      alert('Sign Up Failed')
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              `url(${pic})`,
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <img src={logo} style={{width: 60, height: 60 }} />
            </Box>
            <Typography component="h1" variant="h5">
              Sign Up
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(event) => { setEmail(event.target.value) }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                autoComplete="name"
                autoFocus
                value={name}
                onChange={(event) => { setName(event.target.value) }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => { setPassword(event.target.value) }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container justifyContent={'center'}>
                {/* <Grid item xs>
                  <Button>
                    Forgot password?
                  </Button>
                </Grid> */}
                <Grid item>
                  <Button onClick={() => { navigate('signin') }}>
                    {"Have an account? Sign In"}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}