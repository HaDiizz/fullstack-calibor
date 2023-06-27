import axios from 'axios';
import { ALERT, GET_EVENTS, GET_TOPICS } from '../types';

export const createCalendar = (params, token) => async (dispatch) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_API}/calendar`,
      params,
      { headers: { Authorization: token }, withCredentials: true }
    );
    return response.data;
  } catch (error) {
    dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
  }
};
export const getEventsCalendar = (token) => async (dispatch) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_API}/calendar`,
      { headers: { Authorization: token }, withCredentials: true }
    );
    dispatch({ type: GET_EVENTS, payload: response.data })
    return ;
  } catch (error) {
    dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
  }
};
export const createEvent = (params, token) => async (dispatch) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_API}/calendar/event`,
      params,
      { headers: { Authorization: token }, withCredentials: true }
    );
    return response.data;
  } catch (error) {
    dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
  }
};
export const getEventsTopic = (token) => async (dispatch) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_API}/calendar/events`,
      { headers: { Authorization: token }, withCredentials: true }
    );
    dispatch({ type: GET_TOPICS, payload: response.data })
    return ;
  } catch (error) {
    dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
  }
};
export const deleteEventsTopic = (id, token) => async (dispatch) => {
  try {
    await axios.delete(
      `${import.meta.env.VITE_SERVER_API}/calendar/event/${id}`,
      { headers: { Authorization: token }, withCredentials: true }
    );
    return ;
  } catch (error) {
    dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
  }
};
export const getCurrentMonth = (params, token) => async (dispatch) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_API}/calendar/current`,
      params,
      { headers: { Authorization: token }, withCredentials: true }
    );
    return response.data;
  } catch (error) {
    dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
  }
};
export const getCurrentDate = (token) => async (dispatch) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_API}/calendar/current-date`,
      { headers: { Authorization: token }, withCredentials: true }
    );
    return response.data;
  } catch (error) {
    dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
  }
};
export const updateCalendarEvent = (params, id, token) => async (dispatch) => {
  try {
    await axios.put(
      `${import.meta.env.VITE_SERVER_API}/calendar/${id}`,
      params,
      { headers: { Authorization: token }, withCredentials: true }
    );
    return;
  } catch (error) {
    dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
  }
};
export const deleteCalendarEvent = (id, token) => async (dispatch) => {
  try {
    await axios.delete(
      `${import.meta.env.VITE_SERVER_API}/calendar/${id}`,
      { headers: { Authorization: token }, withCredentials: true }
    );
    return;
  } catch (error) {
    dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
  }
};