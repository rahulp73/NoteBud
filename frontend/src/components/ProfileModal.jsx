import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import { Avatar, Divider, TextField, Tooltip, useTheme } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '../utils/AuthContext';
import axios from 'axios';
import { apiRoot } from '../config';
import { ClearRounded } from '@mui/icons-material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: '80%', md: '70%', lg: '60%', xl: '50%' },
  bgcolor: 'background.paper',
  boxShadow: 24,
  px: 4,
  pb: 3,
  pt: 3,
  borderRadius: 2
};

export default function ProfileModal({ open, handleClose }) {
  const { name: initialName, email: initialEmail, avatar: initialAvatar, login } = useAuth();
  const theme = useTheme();
  const [isEditingName, setIsEditingName] = React.useState(false);
  const [isEditingEmail, setIsEditingEmail] = React.useState(false);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [avatar, setAvatar] = React.useState(null);
  const [avatarPreview, setAvatarPreview] = React.useState(null);

  React.useEffect(() => {
    setName(initialName)
    setEmail(initialEmail)
    setAvatar(initialAvatar)
  }, [open,initialAvatar])

  const handleSaveName = async () => {
    try {
      const response = await axios.put(`${apiRoot}/saveName`, { name }, { withCredentials: true });
      if (response.status === 200) {
        login(response.data.name, response.data.email, response.data.avatar);
        setIsEditingName(false);
      }
    } catch (error) {
      console.error('Error saving name:', error);
    }
  };

  const handleSaveEmail = async () => {
    try {
      const response = await axios.put(`${apiRoot}/saveEmail`, { email }, { withCredentials: true });
      if (response.status === 200) {
        login(response.data.name, response.data.email, response.data.avatar);
        setIsEditingEmail(false);
      }
    } catch (error) {
      console.error('Error saving email:', error);
    }
  };

  const handleSaveAvatar = async () => {
    try {
      const response = await axios.put(`${apiRoot}/setAvatar`, { avatarPreview:avatarPreview.split(',')[1] }, { withCredentials: true });
      if (response.status === 200) {
        login(response.data.name, response.data.email, response.data.avatar);
        setAvatarPreview(null)
      }
    } catch (error) {
      console.error('Error saving avatar:', error);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      // setAvatar(reader.result.split(',')[1]); // Get base64 string
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <IconButton sx={{ position: 'absolute', top: '3%', right: '2%' }} onClick={() => { handleClose() }}>
            <ClearRounded />
          </IconButton>
          <Avatar sx={{ width: 180, height: 180 }} src={avatarPreview ? avatarPreview : avatar} />
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Tooltip title="Edit Avatar">
            <IconButton component="label">
              <EditIcon />
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleAvatarChange}
              />
            </IconButton>
          </Tooltip>
          {avatarPreview && <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <Button variant="contained" onClick={() => { handleSaveAvatar() }} sx={{ mr: 1 }}>Save Avatar</Button>
            <Button variant="outlined" onClick={() => { setAvatarPreview(null) }}>Cancel</Button>
          </Box>}
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" sx={{ color: theme.palette.mode === 'dark' ? '#228B22' : '#81af6a' }}>Name</Typography>

          {isEditingName ? (
            <>
              <TextField
                fullWidth
                variant='standard'
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
              <Box sx={{ mt: 1 }}>
                <Button onClick={handleSaveName} variant="contained" size="small" sx={{ mr: 1 }}>
                  Save
                </Button>
                <Button onClick={() => setIsEditingName(false)} variant="outlined" size="small">
                  Cancel
                </Button>
              </Box>
            </>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h6">{name}</Typography>
              <Tooltip title="Edit Name">
                <IconButton onClick={() => setIsEditingName(true)} size="small">
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="h5" sx={{ color: theme.palette.mode === 'dark' ? '#228B22' : '#81af6a' }}>Email</Typography>
        <Box>
          {isEditingEmail ? (
            <>
              <TextField
                fullWidth
                variant="standard"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
              <Box sx={{ mt: 1 }}>
                <Button onClick={handleSaveEmail} variant="contained" size="small" sx={{ mr: 1 }}>
                  Save
                </Button>
                <Button onClick={() => setIsEditingEmail(false)} variant="outlined" size="small">
                  Cancel
                </Button>
              </Box>
            </>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h6">{email}</Typography>
              <Tooltip title="Edit Email">
                <IconButton onClick={() => setIsEditingEmail(true)} size="small">
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  );
}
