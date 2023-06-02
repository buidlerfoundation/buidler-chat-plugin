import { Channel } from "models";
import Caller from "./Caller";

const ChannelAPI = {
  byId: (channelId: string) => Caller.get<Channel>(`channel/${channelId}`),
  list: (communityId: string) => Caller.get<Channel[]>(`channel/${communityId}`)
};

export default ChannelAPI;
