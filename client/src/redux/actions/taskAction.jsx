import axios from 'axios';
import { ALERT } from '../types';

export const createTask = (params, token) => async (dispatch) => {
    const { id } = params
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_API}/task/${id}`,
      params,
      { headers: { Authorization: token }, withCredentials: true }
    );
    return response.data;
  } catch (error) {
    dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
  }
};
export const removeTask = (id, token) => async (dispatch) => {
  try {
    dispatch({ type: 'ALERT', payload: { loading: true } });
    const response = await axios.delete(
      `${import.meta.env.VITE_SERVER_API}/task/${id}`,
      { headers: { Authorization: token }, withCredentials: true }
    );
    dispatch({ type: ALERT, payload: { success: response.data.msg } });
    return;
  } catch (error) {
    dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
  }
};
export const updateTask = (id, params, token) => async (dispatch) => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_SERVER_API}/task/${id}`,
      params,
      { headers: { Authorization: token }, withCredentials: true }
    );
    dispatch({ type: 'ALERT', payload: {} });

    return response.data;
  } catch (error) {
    dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
  }
};
export const updateTaskPosition = (params, token) => async (dispatch) => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_SERVER_API}/task`,
      params,
      { headers: { Authorization: token }, withCredentials: true }
    );
    dispatch({ type: 'ALERT', payload: {} });

    return;
  } catch (error) {
    dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
  }
};
