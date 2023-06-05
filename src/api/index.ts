import CommunityAPI from "./CommunityAPI";
import UserAPI from "./UserAPI";
import ChannelAPI from "./ChannelAPI";
import MessageAPI from "./MessageAPI";

const api = {
  user: UserAPI,
  community: CommunityAPI,
  channel: ChannelAPI,
  message: MessageAPI,
};

export type ApiType = typeof api;

export default api;
