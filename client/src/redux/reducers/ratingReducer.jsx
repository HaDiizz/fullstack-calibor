import { GET_RATINGS } from "../types";

const initialState = null;

const ratingReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_RATINGS:
      return action.payload;
    default:
      return state;
  }
};

export default ratingReducer;
