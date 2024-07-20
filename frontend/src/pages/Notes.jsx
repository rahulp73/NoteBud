import { AddRounded, ClearRounded, DeleteRounded } from '@mui/icons-material'
import { Box, Divider, IconButton, InputBase, TextField, Tooltip, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useTheme } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import axios from 'axios'
import { apiRoot } from '../config'
import BasicModal from '../components/BasicModal';

export default function Notes() {

  const theme = useTheme();

  const [newNote, setNewNote] = useState('')
  const [notes, setNotes] = useState([])
  const [selectedNote, setSelectedNote] = useState(null);
  const [open, setOpen] = React.useState(false);
  
  const handleOpen = (note) => {
    setSelectedNote(note);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedNote(null);
  };

  const getNotes = async () => {
    const response = await axios.get(`${apiRoot}/getNotes`, { withCredentials: true })
    if (response.status === 200) {
      setNotes(response.data)
    }
  }

  const addNote = async () => {
    const response = await axios.post(`${apiRoot}/newNote`, { newNote }, { withCredentials: true })
    if (response.status === 201) {
      setNewNote('')
      getNotes()
    }
  }

  const deleteNote = async (note_id) => {
    const response = await axios.put(`${apiRoot}/deleteNote`, { note_id }, { withCredentials: true })
    if(response.status === 200){
      getNotes()
    }
  }

  useEffect(() => {
    getNotes()
  }, [])

  return (
    <Box>
      <Box>
        <Box sx={{ mb: 4, width: { xs: '90%', sm: '80%', md: '70%', lg: '60%', xl: '50%' }, mx: 'auto' }}>
          <Box sx={{ p: 1, display: 'flex', alignItems: 'center', borderColor: theme.palette.mode === 'dark' ? '#228B22' : '#81af6a', borderRadius: 1, borderWidth: 3, borderStyle: 'solid' }}>
            <InputBase value={newNote} onChange={(event) => { setNewNote(event.target.value) }} placeholder='Take a Note...' sx={{ pl: 1, fontSize: 25, width: '100%' }} />
            {newNote.length > 0 && <><IconButton size='small' sx={{ '&:hover': { bgcolor: theme.palette.mode === 'dark' ? '#228B22' : '#81af6a' } }} onClick={() => { addNote() }}>
              <AddRounded fontSize='large' />
            </IconButton>
              <IconButton size='small' sx={{ '&:hover': { bgcolor: theme.palette.mode === 'dark' ? '#228B22' : '#81af6a' } }} onClick={() => { setNewNote('') }}>
                <ClearRounded fontSize='large' />
              </IconButton></>}
          </Box>
        </Box>
        {notes.length <= 0 ? <Box sx={{ textAlign: 'center', mt: 30 }}>
          <Typography variant='h2'>
            Write a Note
          </Typography>
        </Box> :
          <Box sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems:'center', flexWrap: 'wrap', gap: 5, px: { md: 5 } }}>
            {notes.map((note) => {
              return <Card key={note.note_id} sx={{ maxWidth: 275, minWidth: 275, borderRadius: 2, '&:hover':{boxShadow:'rgba(0, 0, 0, 0.2) 0px 3px 3px -2px, rgba(0, 0, 0, 0.14) 0px 3px 4px 0px, rgba(0, 0, 0, 0.12) 0px 1px 8px 0px'} }}>
                <CardContent sx={{maxHeight:200, overflow:'hidden'}} onClick={()=>{handleOpen(note)}}>
                  <Typography variant="body2" sx={{whiteSpace:'break-spaces'}}>
                    {note.note}
                  </Typography>
                </CardContent>
                <Divider variant='middle' />
                <CardActions sx={{ display: 'flex', justifyContent: 'flex-end', px: 2 }}>
                  <Tooltip title="Delete">
                    <IconButton onClick={()=>{deleteNote(note.note_id)}}>
                      <DeleteRounded fontSize='small' />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            })}
          </Box>}
      </Box>
      <BasicModal open={open} handleClose={handleClose} selectedNote={selectedNote} getNotes={getNotes}/>
    </Box>
  )
}
