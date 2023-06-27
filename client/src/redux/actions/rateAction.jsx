import axios from "axios";
import { ALERT, GET_RATINGS } from "../types";

export const getRating = (token) => async (dispatch) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_API}/rating`,
      { headers: { Authorization: token }, withCredentials: true }
    );
    dispatch({ type: GET_RATINGS, payload: response.data });
    return;
  } catch (error) {
    dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
  }
};

export const createRating = (data, token) => async (dispatch) => {
  try {
    dispatch({ type: "ALERT", payload: { loading: true } });
    await axios.post(`${import.meta.env.VITE_SERVER_API}/rating`, data, {
      headers: { Authorization: token },
      withCredentials: true,
    });
    dispatch({ type: ALERT, payload: { success: "Thank you for your review! Your feedback is highly appreciated." } });
  } catch (error) {
    dispatch({ type: ALERT, payload: { error: error.response.data.msg } });
  }
};
