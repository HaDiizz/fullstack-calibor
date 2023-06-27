import axios from "axios";
import { GET_SCHEDULE, GET_SCHEDULE_EVENTS, ALERT } from "../types";

export const createScheduleGroup = (data, token) => async (dispatch) => {
  try {
    await axios.post(
      `${import.meta.env.VITE_SERVER_API}/schedule/group/create`,
      { data },
      { headers: { Authorization: token }, withCredentials: true }
    );
    return;
  } catch (error) {
    dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
  }
};
export const getSchedule = (token) => async (dispatch) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_API}/schedule/groups`,
      { headers: { Authorization: token }, withCredentials: true }
    );
    dispatch({ type: GET_SCHEDULE, payload: response.data.data });
    return;
  } catch (error) {
    dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
  }
};
export const getScheduleGroup = (groupId, token) => async (dispatch) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_API}/schedule/group/${groupId}`,
      { headers: { Authorization: token }, withCredentials: true }
    );
    return response.data.data;
  } catch (error) {
    dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
  }
};
export const createSchedule = (params, token) => async (dispatch) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_API}/schedule/group`,
      params,
      { headers: { Authorization: token }, withCredentials: true }
    );
    return response.data;
  } catch (error) {
    dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
  }
};
export const deleteSchedule = (id, token) => async (dispatch) => {
  try {
    await axios.delete(
      `${import.meta.env.VITE_SERVER_API}/schedule/group/${id}`,
      { headers: { Authorization: token }, withCredentials: true }
    );
    return;
  } catch (error) {
    dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
  }
};
export const updateSchedule = (params, id, token) => async (dispatch) => {
  try {
    await axios.put(
      `${import.meta.env.VITE_SERVER_API}/schedule/group/${id}`,
      params,
      { headers: { Authorization: token }, withCredentials: true }
    );
    return;
  } catch (error) {
    dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
  }
};
export const getScheduleEvents = (groupId, token) => async (dispatch) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_API}/schedule/group/events/${groupId}`,
      { headers: { Authorization: token }, withCredentials: true }
    );
    dispatch({ type: GET_SCHEDULE_EVENTS, payload: response.data.data });
    return;
  } catch (error) {
    dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
  }
};
export const getScheduleEventsTopic = (groupId, token) => async (dispatch) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_API}/schedule/group/topics/${groupId}`,
      { headers: { Authorization: token }, withCredentials: true }
    );
    return response.data;
  } catch (error) {
    dispatch({ type: ALERT, payload: { error: "Something went wrong" } });
  }
};
export const createScheduleEvent = (params, token) => async (dispatch) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_API}/schedule/group/topic`,
      params,
      { headers: { Authorization: token }, withCredentials: true }
    );
    return response.data;
  } catch (error) {
    dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
  }
};
export const getScheduleCurrentMonth = (params, token) => async (dispatch) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_API}/schedule/current`,
      params,
      { headers: { Authorization: token }, withCredentials: true }
    );
    return response.data;
  } catch (error) {
    dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
  }
};
export const deleteScheduleTopic = (id, token) => async (dispatch) => {
  try {
    await axios.delete(
      `${import.meta.env.VITE_SERVER_API}/schedule/topics/${id}`,
      { headers: { Authorization: token }, withCredentials: true }
    );
    return;
  } catch (error) {
    dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
  }
};
export const joinGroup = (data, token) => async (dispatch) => {
  try {
    await axios.put(
      `${import.meta.env.VITE_SERVER_API}/group/join`,
      { data },
      { headers: { Authorization: token }, withCredentials: true }
    );
    dispatch({ type: ALERT, payload: { success: "Joined the group." } });
    return;
  } catch (error) {
    dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
  }
};
export const updateImageGroup =
  (params, groupId, token) => async (dispatch) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_SERVER_API}/group/${groupId}`,
        params,
        { headers: { Authorization: token }, withCredentials: true }
      );
      return;
    } catch (error) {
      dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
    }
  };
export const updateGroup = (params, token) => async (dispatch) => {
  const { groupId } = params;
  try {
    await axios.put(
      `${import.meta.env.VITE_SERVER_API}/group/detail/${groupId}`,
      params,
      { headers: { Authorization: token }, withCredentials: true }
    );
    return;
  } catch (error) {
    dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
  }
};
export const leaveGroup = (userId, groupId, token) => async (dispatch) => {
  try {
    await axios.put(
      `${import.meta.env.VITE_SERVER_API}/group/leave/${groupId}`,
      { userId },
      { headers: { Authorization: token }, withCredentials: true }
    );
    return;
  } catch (error) {
    dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
  }
};
export const deleteGroup = (groupId, token) => async (dispatch) => {
  try {
    await axios.delete(
      `${import.meta.env.VITE_SERVER_API}/group/delete/${groupId}`,
      { headers: { Authorization: token }, withCredentials: true }
    );
    return;
  } catch (error) {
    dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
  }
};
export const removeFromGroup = (userId, groupId, token) => async (dispatch) => {
  try {
    await axios.put(
      `${import.meta.env.VITE_SERVER_API}/group/remove/${groupId}`,
      { userId },
      { headers: { Authorization: token }, withCredentials: true }
    );
    return;
  } catch (error) {
    dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
  }
};
