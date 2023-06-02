import CommunityAPI from "./CommunityAPI";
import UserAPI from "./UserAPI";
import ChannelAPI from "./ChannelAPI";

const api = {
  user: UserAPI,
  community: CommunityAPI,
  channel: ChannelAPI
};

export type ApiType = typeof api;

export default api;
