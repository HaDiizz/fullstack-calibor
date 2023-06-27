import axios from 'axios';
import { ALERT } from '../types';

export const createSection = (id, token) => async (dispatch) => {
  try {
    // dispatch({ type: 'ALERT', payload: { loading: true } });
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_API}/section/${id}`,
      {},
      { headers: { Authorization: token }, withCredentials: true }
    );
    // dispatch({ type: ALERT, payload: { success: 'Created Successfully' } });
    return response.data;
  } catch (error) {
    dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
  }
};
export const deleteSection = (id, token) => async (dispatch) => {
  try {
    dispatch({ type: 'ALERT', payload: { loading: true } });
    const response = await axios.delete(
      `${import.meta.env.VITE_SERVER_API}/section/${id}`,
      { headers: { Authorization: token }, withCredentials: true }
    );
    dispatch({ type: ALERT, payload: { success: response.data.msg } });
    return;
  } catch (error) {
    dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
  }
};
export const updateSection = (params, token) => async (dispatch) => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_SERVER_API}/section/${params.id}`,
      params,
      { headers: { Authorization: token }, withCredentials: true }
    );
    dispatch({ type: 'ALERT', payload: {} });

    return;
  } catch (error) {
    dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
  }
};
