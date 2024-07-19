import pool from '../db.js'; // Ensure you have a pool instance from pg or similar

export const getNotes = async (req, res) => {
    const user_id = req._id; // Access the user_id from the request object
    try {
        const result = await pool.query('SELECT * FROM notes WHERE user_id = $1 ORDER BY note_id ASC', [user_id]);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching notes:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getDeletedNotes = async (req, res) => {
    const user_id = req._id; // Access the user_id from the request object
    try {
        const result = await pool.query('SELECT * FROM deleted_notes WHERE user_id = $1 ORDER BY note_id ASC', [user_id]);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching deleted notes:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const addNote = async (req, res) => {
    const user_id = req._id; // Access the user_id from the request object
    const { newNote } = req.body; // Access the newNote from the request body

    if (!newNote) {
        return res.status(400).json({ message: 'Note content is required' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO Notes (user_id, note) VALUES ($1, $2) RETURNING *',
            [user_id, newNote]
        );
        (result.rows[0])
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error adding note:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const deleteNote = async (req, res) => {
    const noteId = req.body.note_id;
    const userId = req._id;
  
    try {
      // Start a transaction
      await pool.query('BEGIN');
  
      // Get the note to be deleted
      const noteResult = await pool.query(
        'SELECT * FROM Notes WHERE note_id = $1 AND user_id = $2',
        [noteId, userId]
      );
  
      if (noteResult.rowCount === 0) {
        await pool.query('ROLLBACK');
        return res.status(404).json({ message: 'Note not found or not authorized' });
      }
  
      const note = noteResult.rows[0];
  
      // Insert the note into the deleted_notes table
      await pool.query(
        'INSERT INTO deleted_notes (note_id, user_id, note) VALUES ($1, $2, $3)',
        [note.note_id, note.user_id, note.note]
      );
  
      // Delete the note from the notes table
      await pool.query(
        'DELETE FROM Notes WHERE note_id = $1 AND user_id = $2',
        [noteId, userId]
      );
  
      // Commit the transaction
      await pool.query('COMMIT');
  
      res.status(200).json({ message: 'Note moved to deleted notes successfully' });
    } catch (err) {
      await pool.query('ROLLBACK');
      console.error('Error deleting note:', err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  export const restoreNote = async (req, res) => {
    const noteId = req.body.note_id;
    const userId = req._id; // Assuming you have req._id set by your auth middleware
  
    try {
      await pool.query('BEGIN'); // Begin transaction
  
      // Check if the note exists in deleted_notes for the current user
      const deletedNoteQuery = await pool.query('SELECT * FROM deleted_notes WHERE note_id = $1 AND user_id = $2', [noteId, userId]);
  
      if (deletedNoteQuery.rows.length === 0) {
        await pool.query('ROLLBACK'); // Rollback transaction
        return res.status(404).json({ message: 'Note not found in deleted notes' });
      }
      const { note } = deletedNoteQuery.rows[0];
  
      // Restore the note to the notes table
      await pool.query('INSERT INTO notes (user_id, note) VALUES ($1, $2)', [userId, note]);
  
      // Delete the note from deleted_notes
      await pool.query('DELETE FROM deleted_notes WHERE note_id = $1 AND user_id = $2', [noteId, userId]);
  
      await pool.query('COMMIT'); // Commit transaction
  
      res.status(200).json({ message: 'Note restored successfully' });
    } catch (error) {
      await pool.query('ROLLBACK'); // Rollback transaction on error
      console.error('Error restoring note:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  export const updateNote = async (req, res) => {
    const { note_id, note } = req.body;
    const user_id = req._id;
  
    try {
      await pool.query(
        'UPDATE notes SET note = $1 WHERE note_id = $2 AND user_id = $3',
        [note, note_id, user_id]
      );
      res.status(200).json({ message: 'Note updated successfully' });
    } catch (error) {
      console.error('Error updating note:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  export const deleteNotePermanently = async (req, res) => {
    const note_id = req.body.note_id;
    const user_id = req._id;
    try {
      const result = await pool.query('DELETE FROM deleted_notes WHERE note_id = $1 AND user_id = $2', [note_id,user_id]);
      res.status(200).json({ message: 'Note deleted permanently' });
    } catch (err) {
      console.error('Error deleting note permanently:', err);
      res.status(500).json({ message: 'Failed to delete note permanently' });
    }
  }; 