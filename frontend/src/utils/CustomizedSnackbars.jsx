import * as React from 'react';
import Snackbar from '@mui/joy/Snackbar';
import Alert from '@mui/joy/Alert';

export default function CustomizedSnackbars({ open, setOpen }) {

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <div>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="warning"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Layer Does Not Exist
        </Alert>
      </Snackbar>
    </div>
  );
}
