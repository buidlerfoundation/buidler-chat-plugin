import { useMemo } from "react";
import useChannelId from "./useChannelId";
import useAppSelector from "./useAppSelector";

function useMessageData(id?: string) {
  const matchChannelId = useChannelId();
  const channelId = id || matchChannelId;
  const messageData = useAppSelector((state) => state.message.messageData);
  return useMemo(() => messageData[channelId], [channelId, messageData]);
}

export default useMessageData;
