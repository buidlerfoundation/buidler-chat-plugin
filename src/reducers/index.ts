import UserReducers from "./UserReducers";
import { combineReducers } from "redux";
import NetworkReducers from "./NetworkReducers";

const reducers = combineReducers({
  user: UserReducers,
  network: NetworkReducers,
});

export default reducers;
