import UserReducers from "./UserReducers";
import { combineReducers } from "redux";
import NetworkReducers from "./NetworkReducers";
import MessageReducers from "./MessageReducers";

const reducers = combineReducers({
  user: UserReducers,
  network: NetworkReducers,
  message: MessageReducers,
});

export default reducers;
