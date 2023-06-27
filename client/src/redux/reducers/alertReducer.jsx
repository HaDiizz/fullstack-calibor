
import { ALERT } from "../types";

const initialState = {};

const alertReducer = (state = initialState, action) => {
  switch (action.type) {
    case ALERT:
      return action.payload;
    default:
      return state;
  }
};

export default alertReducer;