import { combineReducers } from "redux";
import auth from "./authReducer";
import alert from "./alertReducer";
import theme from './themeReducer'
import boards from "./boardReducer";
import favorites from "./favoriteReducer";
import events from "./calendarReducer";
import topics from "./topicEventReducer";
import groups from "./scheduleReducer";
import works from './scheduleEventReducer'
import rates from './ratingReducer'

export default combineReducers({
  auth,
  alert,
  theme,
  boards,
  favorites,
  events,
  topics,
  groups,
  works,
  rates
});