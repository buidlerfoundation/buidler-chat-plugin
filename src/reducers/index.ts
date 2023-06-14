import UserReducers from "./UserReducers";
import { combineReducers } from "redux";
import NetworkReducers from "./NetworkReducers";
import MessageReducers from "./MessageReducers";
import SessionReducers from "./SessionReducers";

const reducers = combineReducers({
  user: UserReducers,
  network: NetworkReducers,
  message: MessageReducers,
  session: SessionReducers,
});

export default reducers;
