import { AUTH, UPDATE_LINE_TOKEN } from "../types";

const initialState = {};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH:
      return action.payload;
    case UPDATE_LINE_TOKEN:
      return {
        ...state,
        user: {
          ...state.user,
          lineToken: action.payload,
        },
      };
    default:
      return state;
  }
};

export default authReducer;