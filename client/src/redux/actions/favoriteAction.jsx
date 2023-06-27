import axios from 'axios';
import { ALERT, GET_FAVORITES } from '../types';

export const getFavorites = (token) => async (dispatch) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_API}/favorites`,
      { headers: { Authorization: token }, withCredentials: true }
    );
    dispatch({ type: GET_FAVORITES, payload: response.data });
    return;
  } catch (error) {
    dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
  }
};

export const updateFavoritePosition = (params, token) => async (dispatch) => {
  try {
    await axios.put(
      `${import.meta.env.VITE_SERVER_API}/favorite`,
      { boards: params },
      { headers: { Authorization: token }, withCredentials: true }
    );
    return;
  } catch (error) {
    dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
  }
};
