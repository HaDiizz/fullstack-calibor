import React, { useEffect, useState } from 'react';
import LogInButton from '../components/LogInButton';
import { useDispatch, useSelector } from 'react-redux';
import { signIn, token } from '../redux/actions/authAction';
import { useNavigate } from 'react-router-dom';
import { gapi } from 'gapi-script';

const Login = () => {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const localStorageKey = 'google_account_info';

  const onSuccessLogin = async (response) => {
    const isLoggedIn = await localStorage.getItem('loggedIn');
    if (isLoggedIn) {
      localStorage.removeItem('loggedIn');
      localStorage.removeItem(localStorageKey);
      // Clear the Google Sign-In session
      // const auth2 = window.gapi.auth2.getAuthInstance();
      // auth2.signOut();
      const auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut();
      await dispatch(token());
    } else {
      await dispatch(signIn(response));
    }
  };

  const onFailureLogin = (error) => {
    console.error('Login failed: ', error);
    dispatch({ type: 'ALERT', payload: { error: 'Popup Closed' } });
  };

  useEffect(() => {
    if (auth.token) navigate('/');
  }, [auth.token, navigate]);

  return (
    <div className='flex justify-center h-screen'>
      <div className='my-auto'>
        <LogInButton onSuccess={onSuccessLogin} onFailure={onFailureLogin} />
      </div>
    </div>
  );
};

export default Login;
