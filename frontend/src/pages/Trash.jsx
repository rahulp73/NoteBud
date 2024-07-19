import { Box, Button, Card, CardActions, CardContent, Divider, IconButton, Tooltip, Typography } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { apiRoot } from '../config'
import { DeleteForeverRounded, RestoreFromTrashRounded } from '@mui/icons-material'

export default function Trash() {


  const [deletedNotes, setDeletedNotes] = useState([])

  const getDeletedNotes = async () => {
    const response = await axios.get(`${apiRoot}/getDeletedNotes`, { withCredentials: true })
    if (response.status === 200) {
      setDeletedNotes(response.data)
    }
  }

  const restoreNote = async(note_id)=>{
    const response = await axios.put(`${apiRoot}/restoreNote`, { note_id }, { withCredentials: true })
    if(response.status === 200){
      getDeletedNotes()
    }
  }

  const deleteNotePermanently = async(note_id)=>{
    const response = await axios.put(`${apiRoot}/deleteNotePermanently`, { note_id }, { withCredentials: true })
    if(response.status === 200){
      getDeletedNotes()
    }
  }

  useEffect(() => {
    getDeletedNotes()
  }, [])

  return (
    <Box>
      {deletedNotes.length <= 0 ? <Box sx={{ textAlign: 'center', mt: 30 }}>
        <Typography variant='h2'>
          Trash is Empty
        </Typography>
      </Box> :
        <Box sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', flexWrap: 'wrap', gap: 5, px: { md: 5 } }}>
          {deletedNotes.map((note) => {
            return <Card key={note.note_id} sx={{ maxWidth: 275, minWidth: 275, borderRadius: 2, '&:hover': { boxShadow: '0px 2px 1px -1px rgba(0,0,0),0px 1px 1px 0px rgba(0,0,0),0px 1px 3px 0px rgba(0,0,0)' } }}>
              <CardContent sx={{ maxHeight: 200, overflow: 'hidden' }}>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                  {note.note}
                </Typography>
              </CardContent>
              <Divider variant='middle' />
              <CardActions sx={{ display: 'flex', justifyContent: 'flex-end', px: 2 }}>
                <Tooltip title="Restore">
                  <IconButton onClick={() => { restoreNote(note.note_id) }}>
                    <RestoreFromTrashRounded fontSize='small' />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton onClick={() => { deleteNotePermanently(note.note_id) }}>
                    <DeleteForeverRounded fontSize='small' />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          })}
        </Box>}
    </Box>
  )
}
