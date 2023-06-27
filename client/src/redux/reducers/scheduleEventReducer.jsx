import { GET_SCHEDULE_EVENTS } from "../types";

const initialState = null;

const scheduleReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SCHEDULE_EVENTS:
      return action.payload;
    default:
      return state;
  }
};

export default scheduleReducer;