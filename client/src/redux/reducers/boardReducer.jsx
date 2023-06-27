import { GET_ALL_BOARDS, CREATE_BOARD } from "../types";

const initialState = null;

const boardReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_BOARD:
      return action.payload;
    case GET_ALL_BOARDS:
      return action.payload;
    default:
      return state;
  }
};

export default boardReducer;