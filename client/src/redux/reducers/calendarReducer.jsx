import { GET_EVENTS } from "../types";

const initialState = null;

const calendarReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_EVENTS:
      return action.payload;
    default:
      return state;
  }
};

export default calendarReducer;