import { GET_FAVORITES } from "../types";

const initialState = null;

const favoriteReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_FAVORITES:
      return action.payload;
    default:
      return state;
  }
};

export default favoriteReducer;