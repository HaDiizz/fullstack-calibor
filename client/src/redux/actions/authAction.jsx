import { AUTH, ALERT } from '../types';
import axios from 'axios';

export const signIn = (data) => async (dispatch) => {
  // const emailRegex = /^(\d{10})@psu\.ac\.th$/;
  // const email = data.profileObj.email;

  // if (!emailRegex.test(email)) {
  //   dispatch({
  //     type: ALERT,
  //     payload: { error: 'Invalid email format.' },
  //   });

  //   return;
  // }
  try {
    localStorage.setItem('loggedIn', true);
    dispatch({ type: 'ALERT', payload: { loading: true } });
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_API}/google-auth`,
      { tokenId: data.tokenId },
      { withCredentials: true }
    );
    dispatch({
      type: AUTH,
      payload: {
        token: response.data.token,
        user: response.data.user,
      },
    });
    dispatch({ type: ALERT, payload: { success: 'Login Successfully' } });
  } catch (error) {
    dispatch({ type: ALERT, payload: { error: 'Something went wrong' } });
  }
};
export const postLineToken = (lineToken, token) => async (dispatch) => {
  try {
    await axios.post(
      `${import.meta.env.VITE_SERVER_API}/auth/line-token`,
      {lineToken},
      { headers: { Authorization: token }, withCredentials: true }
    );
    dispatch({ type: ALERT, payload: { success: 'Saved Successfully' } });
  } catch (error) {
    dispatch({ type: ALERT, payload: { error: 'Something went wrong' } });
  }
};
export const lineAuthToken = (formData, token) => async (dispatch) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_SERVER_API}/auth/line-auth`,
      {formData},
      { headers: { Authorization: token }, withCredentials: true }
    );
    dispatch({ type: 'UPDATE_LINE_TOKEN', payload: res.data.lineToken })
    dispatch({ type: ALERT, payload: { success: 'Saved Successfully' } });
    return res.data
  } catch (error) {
    dispatch({ type: ALERT, payload: { error: 'Something went wrong' } });
  }
};
export const lineRevoke = (token) => async (dispatch) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_SERVER_API}/auth/line-revoke`,
      {},
      { headers: { Authorization: token }, withCredentials: true }
    );
    dispatch({ type: ALERT, payload: { success: 'Disconnected Line Notify Successfully' } });
    return res.data
  } catch (error) {
    dispatch({ type: ALERT, payload: { error: 'Something went wrong' } });
  }
};
export const token = () => async (dispatch) => {
  const isLoggedIn = localStorage.getItem('loggedIn');

  try {
    if (isLoggedIn) {
      dispatch({ type: 'ALERT', payload: { loading: true } });
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_API}/google-token`,
        {},
        { withCredentials: true }
      );
      dispatch({
        type: AUTH,
        payload: {
          token: response.data.token,
          user: response.data.user,
        },
      });
      dispatch({ type: ALERT, payload: {} });
    }
  } catch (error) {
    dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
  }
};

export const logout = () => async (dispatch) => {
  try {
    localStorage.removeItem('loggedIn');
    await axios.post(
      `${import.meta.env.VITE_SERVER_API}/google-logout`,
      {},
      { withCredentials: true }
    );
    dispatch({
      type: AUTH,
      payload: {},
    });
    dispatch({ type: ALERT, payload: { success: 'Logout Successfully' } });
  } catch (err) {
    dispatch({
      type: ALERT,
      payload: { error: 'Something went wrong' },
    });
  }
};
