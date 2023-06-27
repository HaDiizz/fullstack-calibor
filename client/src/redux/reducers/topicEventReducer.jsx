import { GET_TOPICS } from "../types";

const initialState = null;

const calendarReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_TOPICS:
      return action.payload;
    default:
      return state;
  }
};

export default calendarReducer;