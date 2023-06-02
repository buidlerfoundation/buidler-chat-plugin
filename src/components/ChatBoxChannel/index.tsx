import React, { memo } from "react";
import styles from "./index.module.scss";
import useAppSelector from "hooks/useAppSelector";
import ChannelIcon from "components/ChannelIcon";

const ChatBoxChannel = () => {
  const channel = useAppSelector((state) => state.user.channel);
  return (
    <div className={styles.container}>
      <div className={`${styles["channel-name__wrapper"]} pl-5`}>
        <ChannelIcon channel={channel} />
        <span className="text-lg font-bold text-primary ml-2.5 truncate">
          {channel?.channel_name}
        </span>
      </div>
      <div className="p-4 cursor-pointer">
        <span className="font-semibold text-link">View all channels</span>
      </div>
    </div>
  );
};

export default memo(ChatBoxChannel);
