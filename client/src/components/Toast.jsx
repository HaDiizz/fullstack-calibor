import React, { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const Toast = ({ msg }) => {
  useEffect(() => {
    if (msg.statusErr) {
        toast.error(`${msg.msg}`, {
          id: 'clipboard',
        });
      }
      if (msg.statusSucc) {
        toast.success(`${msg.msg}`, {
          id: 'clipboard',
        });
      }
  }, []);

  return <Toaster />
};

export default Toast;