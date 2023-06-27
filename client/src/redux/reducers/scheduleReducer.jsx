import { GET_SCHEDULE } from "../types";

const initialState = null;

const scheduleReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SCHEDULE:
      return action.payload;
    default:
      return state;
  }
};

export default scheduleReducer;