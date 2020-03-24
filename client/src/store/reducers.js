import { combineReducers } from 'redux'

import profile from './redux/profile'

export default combineReducers({
  ...profile
});
