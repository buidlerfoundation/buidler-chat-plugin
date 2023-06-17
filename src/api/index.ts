import CommunityAPI from "./CommunityAPI";
import UserAPI from "./UserAPI";
import ChannelAPI from "./ChannelAPI";
import MessageAPI from "./MessageAPI";
import UploadAPI from "./Upload";

const api = {
  user: UserAPI,
  community: CommunityAPI,
  channel: ChannelAPI,
  message: MessageAPI,
  upload: UploadAPI,
};

export type ApiType = typeof api;

export default api;
