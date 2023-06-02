import { Community } from "models";
import Caller from "./Caller";

const CommunityAPI = {
  byId: (communityId: string) => Caller.get<Community>(`team/${communityId}`),
};

export default CommunityAPI;
