import axios from "axios";
import { GET_ALL_BOARDS, CREATE_BOARD, ALERT } from "../types";
import { useNavigate } from "react-router-dom";

export const createBoard = (data, token) => async (dispatch) => {
  try {
    dispatch({ type: "ALERT", payload: { loading: true } });
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_API}/create`,
      data,
      { headers: { Authorization: token }, withCredentials: true }
    );
    dispatch({ type: ALERT, payload: { success: "Created Successfully" } });
    return response.data;
  } catch (error) {
    dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
  }
};
export const getAllBoards = (token) => async (dispatch) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_API}/boards`,
      { headers: { Authorization: token }, withCredentials: true }
    );
    return response.data;
  } catch (error) {
    dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
  }
};
export const updatePosition = (params, token) => async (dispatch) => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_SERVER_API}/board`,
      { boards: params },
      { headers: { Authorization: token }, withCredentials: true }
    );
    return response.data;
  } catch (error) {
    dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
  }
};
export const getOneBoard = (id, token) => async (dispatch) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_API}/board/${id}`,
      { headers: { Authorization: token }, withCredentials: true }
    );
    return response.data;
  } catch (error) {
    dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
  }
};
export const updateBoard = (params, token) => async (dispatch) => {
  const { id } = params;
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_SERVER_API}/board/${id}`,
      params,
      { headers: { Authorization: token }, withCredentials: true }
    );
    return response.data;
  } catch (error) {
    dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
  }
};
export const deleteBoard = (id, token) => async (dispatch) => {
  try {
    await axios.delete(`${import.meta.env.VITE_SERVER_API}/board/${id}`, {
      headers: { Authorization: token },
      withCredentials: true,
    });
    return;
  } catch (error) {
    dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
  }
};
export const inviteUserToBoard = (ids, token) => async (dispatch) => {
  try {
    await axios.put(`${import.meta.env.VITE_SERVER_API}/board/invite`, ids, {
      headers: { Authorization: token },
      withCredentials: true,
    });
    return;
  } catch (error) {
    dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
  }
};
export const leaveFromBoard = (ids, token) => async (dispatch) => {
  try {
    await axios.put(`${import.meta.env.VITE_SERVER_API}/board/leave`, ids, {
      headers: { Authorization: token },
      withCredentials: true,
    });
    return;
  } catch (error) {
    dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
  }
};

export const removeMemberFromGroup = (ids, token) => async (dispatch) => {
  try {
    await axios.put(`${import.meta.env.VITE_SERVER_API}/board/remove-member`, ids, {
      headers: { Authorization: token },
      withCredentials: true,
    });
    return;
  } catch (error) {
    dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
  }
};
