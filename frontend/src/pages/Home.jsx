import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText'
import { DeleteRounded, LogoutRounded, MenuRounded, PersonRounded, StickyNote2Rounded } from '@mui/icons-material';
import { Avatar, Button, Card, Collapse, Divider } from '@mui/material';
import logo from '../img/logo.png'
import CardContent from '@mui/material/CardContent';
import { NavLink, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie'
import { useAuth } from '../utils/AuthContext';
import ProfileModal from '../components/ProfileModal';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  // transition: theme.transitions.create(['width', 'margin'], {
  //   easing: theme.transitions.easing.sharp,
  //   duration: theme.transitions.duration.leavingScreen,
  // }),
  // ...(open && {
  //   marginLeft: drawerWidth,
  //   width: `calc(100% - ${drawerWidth}px)`,
  //   transition: theme.transitions.create(['width', 'margin'], {
  //     easing: theme.transitions.easing.sharp,
  //     duration: theme.transitions.duration.enteringScreen,
  //   }),
  // }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function Home({ setAuthToken }) {

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [profile, setProfile] = React.useState(false)
  const { name, avatar, logout } = useAuth();
  const [openProfile, setOpenProfile] = React.useState(false)

  const handleDrawerOpen = () => {
    setOpen(!open);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    Cookies.remove('token')
    setAuthToken(false)
    logout()
  }

  const handleOpenProfile = () => {
    setOpenProfile(true);
  };
  const handleCloseProfile = () => {
    setOpenProfile(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} sx={{ bgcolor: theme.palette.mode === 'dark' ? '#000000' : '#ffffff', boxShadow: '0px 0px 0px 0px' }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 2,
              '&:hover': {bgcolor:theme.palette.mode === 'dark' ? '#228B22' : '#81af6a'}
            }}
          >
            <MenuRounded />
          </IconButton>
          <img src={logo} style={{ marginRight: 10, width:40, height:40 }} />
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontFamily:'Montserrat' }}>
            NoteBud
          </Typography>
          <Box>
            <Button sx={{marginRight:1}}><a href='https://oldnotebud.rahulp.fun' style={{textDecoration: 'none', color: 'inherit'}}>Old NoteBud</a></Button>
          </Box>
          <Box sx={{ padding: '4px', borderRadius: '50%', "&:hover": { bgcolor: theme.palette.mode === 'dark' ? '#228B22' : '#81af6a' }, transition: 'all 0.3s' }} onClick={() => { setProfile(!profile) }} >
            <Avatar src={avatar} sx={{color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000'}}/>
          </Box>
          <Collapse in={profile} sx={{ position: 'absolute', right: 5, top: '110%' }}>
            <Card sx={{ minWidth:275, borderRadius: 5, p: 1, boxShadow:'rgba(0, 0, 0, 0.2) 0px 3px 3px -2px, rgba(0, 0, 0, 0.14) 0px 3px 4px 0px, rgba(0, 0, 0, 0.12) 0px 1px 8px 0px' }}>
              <CardContent>
                <Box component='div' sx={{ p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: theme.palette.mode === 'dark' ? '#228B22' : '#81af6a' }}>
                  <Avatar src={avatar} sx={{ width: 56, height: 56, color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000' }} />
                  <Typography sx={{ fontSize: 20, textOverflow: 'ellipsis', maxWidth: 120, mx: 'auto' }}>
                    <strong>{name}</strong>
                  </Typography>
                </Box>
              </CardContent>
              <Divider variant='middle' />
              <Box sx={{my:2, flexWrap:'wrap'}}>
                <Box onClick={()=>{handleOpenProfile()}} component='div' sx={{ px:3, display: 'flex', alignItems: 'center', width:'100%', cursor:'pointer' }}>
                  <Avatar>
                    <PersonRounded sx={{color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000'}} />
                  </Avatar>
                  <Typography sx={{marginLeft:'10%'}}>
                    Edit Profile
                  </Typography>
                </Box>
                <Box component='div' sx={{ mt:2, px:3, display: 'flex', alignItems: 'center', width:'100%', cursor:'pointer' }} onClick={() => {handleLogout()}}>
                  <Avatar>
                    <LogoutRounded sx={{color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000'}}/>
                  </Avatar>
                  <Typography sx={{marginLeft:'10%'}}>
                    Logout
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Collapse>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open} sx={{ '& .MuiDrawer-paper': { borderRight: 'none' } }}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <List>
          <NavLink to='/notes' style={{ textDecoration: 'none', color: 'inherit' }}>
            {({ isActive }) => (
              <ListItem key={'Notes'} disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  sx={{
                    bgcolor: isActive
                      ? theme.palette.mode === 'dark'
                        ? theme.palette.primary.main // #228B22 in dark mode
                        : theme.palette.primary.main // #81af6a in light mode
                      : '',
                    borderRadius: isActive ? '0px 50px 50px 0px' : '',
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    '&:hover': isActive ? {} : {
                      borderRadius: '0px 50px 50px 0px',
                    }
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    <StickyNote2Rounded />
                  </ListItemIcon>
                  <ListItemText primary={'Notes'} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            )}
          </NavLink>
          <NavLink to='/trash' style={{ textDecoration: 'none', color: 'inherit' }}>
            {({ isActive }) => (
              <ListItem key={'Trash'} disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  sx={{
                    bgcolor: isActive
                      ? theme.palette.mode === 'dark'
                        ? theme.palette.primary.main // #228B22 in dark mode
                        : theme.palette.primary.main // #81af6a in light mode
                      : '',
                    borderRadius: isActive ? '0px 50px 50px 0px' : '',
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    '&:hover': isActive ? {} : {
                      borderRadius: '0px 50px 50px 0px',
                    }
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    <DeleteRounded />
                  </ListItemIcon>
                  <ListItemText primary={'Trash'} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            )}
          </NavLink>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Outlet />
      </Box>
      <ProfileModal open={openProfile} handleClose={handleCloseProfile} />
    </Box>
  );
}
