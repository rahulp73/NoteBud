import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { TextareaAutosize } from '@mui/base';
import { Divider, useTheme } from '@mui/material';
import axios from 'axios';
import { apiRoot } from '../config';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  px: 2,
  pb: 1,
  pt: 2,
  borderRadius: 2
};

export default function BasicModal({ open, handleClose, selectedNote, getNotes }) {

  const theme = useTheme()
  const [noteContent, setNoteContent] = React.useState(selectedNote?.note);

  React.useEffect(()=>{
    setNoteContent(selectedNote?.note)
  },[selectedNote])

  const textAreaStyle = {
    width: '100%',
    fontSize: 18,
    color: theme.palette.mode === 'dark' ? 'white' : 'black',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    resize: 'none',
    '&:focus': {
      border: 'none',
      outline: 'none'
    },

    // firefox
    '&:focusVisible': {
      outline: 0,
      border: 'none'
    }
  }

  const handleSave = async () => {
    if (selectedNote && noteContent !== selectedNote.note) {
      const response = await axios.put(`${apiRoot}/updateNote`, { note_id: selectedNote.note_id, note: noteContent }, { withCredentials: true });
      if (response.status === 200) {
        getNotes();
      }
    }
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={()=>{handleSave()}}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        {/* <Typography variant='h4' sx={{ mb: 1 }}>Title</Typography>
        <Divider sx={{ mb: 1 }} /> */}
        <TextareaAutosize
          maxRows={15}
          minRows={15}
          style={textAreaStyle}
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
        />
        <Divider sx={{ mb: 1 }} />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Button onClick={()=>{handleSave()}}>Save Changes</Button>
          <Button onClick={()=>{handleClose()}}>Close</Button>
        </Box>
      </Box>
    </Modal>
  );
}
