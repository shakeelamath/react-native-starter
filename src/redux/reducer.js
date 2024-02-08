import { combineReducers } from 'redux';
import { LOGIN_SUCCESS } from './actionTypes'; // Import the LOGIN_SUCCESS action type

// ## Generator Reducer Imports
import gallery from '../modules/gallery/GalleryState';
import app from '../modules/AppState';
import calendar from '../modules/calendar/CalendarState';

// Initial authentication state
const initialAuthState = {
  isAuthenticated: false,
  // other authentication-related properties
};

// Authentication reducer
const authReducer = (state = initialAuthState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
      };
    // handle other authentication-related actions as needed
    default:
      return state;
  }
};

// Combine all reducers
export default combineReducers({
  // ## Generator Reducers
  gallery,
  app,
  calendar,
  auth: authReducer, // Include the authReducer as part of your combined reducers
  // add other reducers as needed
});
