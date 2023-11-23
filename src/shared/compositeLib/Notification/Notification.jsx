import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import './Notification.scss';
import { Typography } from '@mui/material';

export default function Notification({ alert = {}, open, callback }) {
  const handleClose = () => {
    callback();
  };

  function getAlertType() {
    switch (alert.type) {
      case 'error':
        return (
          <Alert
            onClose={handleClose}
            className="notificationerror"
            severity="error"
          >
            <Typography className="alertmessage">{alert.message}</Typography>
          </Alert>
        );
      case 'success':
        return (
          <Alert
            className="notificationsuccess"
            onClose={handleClose}
            severity="success"
          >
            <Typography className="alertmessage">{alert.message}</Typography>
          </Alert>
        );
      case 'warning':
        return (
          <Alert
            onClose={handleClose}
            className="notificationwarning"
            severity="warning"
          >
            <Typography className="alertmessage">{alert.message}</Typography>
          </Alert>
        );
      default:
        return (
          <Alert
            onClose={handleClose}
            className="notificationinfo"
            severity="info"
          >
            <Typography className="alertmessage">{alert.message}</Typography>
          </Alert>
        );
    }
  }
  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open}
        autoHideDuration={alert?.timeout}
        onClose={handleClose}
        className="notification"
      >
        {getAlertType()}
      </Snackbar>
    </Stack>
  );
}
