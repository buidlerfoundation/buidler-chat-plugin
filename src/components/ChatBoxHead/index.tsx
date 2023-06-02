import ChatBoxChannel from "components/ChatBoxChannel";
import CommunityFloat from "components/CommunityFloat";
import React, { memo } from "react";

const ChatBoxHead = () => {
  return (
    <>
      <CommunityFloat />
      <ChatBoxChannel />
    </>
  );
};

export default memo(ChatBoxHead);
