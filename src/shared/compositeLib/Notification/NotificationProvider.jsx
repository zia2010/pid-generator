import React, { useCallback, useContext } from 'react';
import { useSelector } from 'react-redux';
import Notification from './Notification';

const NotificationContext = React.createContext(() => {});

const NotificationProvider = ({ children }) => {
  const notification = useSelector((state) => state.notificationReducer.alert);
  const [alert, setAlert] = React.useState();
  const [open, setOpen] = React.useState(false);

  const callback = () => {
    setOpen(false);
  };

  const openAlert = useCallback(
    ({ type, headerTitle, message, timeout } = {}) => {
      const alertTimeout = timeout || (type === 'error' ? 300000 : 300000);
      const alertObj = {
        type,
        headerTitle,
        message,
      };
      setAlert(alertObj);
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, alertTimeout);
    }
  );

  React.useEffect(() => {
    const { showAlert, message, type, timeout } = notification;
    if (notification && showAlert === true) {
      openAlert({
        type,
        message,
        timeout,
      });
    }
  }, [notification]);

  return (
    <>
      <NotificationContext.Provider value={openAlert}>
        {children}
      </NotificationContext.Provider>
      <Notification alert={alert} open={open} callback={callback} />
    </>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      'useNotification can only be used inside NotificationProvider'
    );
  }
  return context;
};

export default NotificationProvider;
