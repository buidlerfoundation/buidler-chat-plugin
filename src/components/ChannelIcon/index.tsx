import React, { memo } from "react";
import ImageHelper from "common/ImageHelper";
import images from "common/images";
import { Channel } from "models";
import useCommunityId from "hooks/useCommunityId";
import styles from "./index.module.scss";

type ChannelIconProps = {
  channel?: Channel;
};

const ChannelIcon = ({ channel }: ChannelIconProps) => {
  const communityId = useCommunityId();
  if (!channel) return null;
  if (channel?.channel_image_url) {
    return (
      <img
        className={styles["channel-icon"]}
        src={ImageHelper.normalizeImage(
          channel.channel_image_url,
          channel?.team_id || communityId
        )}
        alt=""
      />
    );
  }
  if (channel?.channel_emoji) {
    return (
      <em-emoji id={channel?.channel_emoji} size="1rem" set="apple"></em-emoji>
    );
  }
  return (
    <img
      className={styles["channel-icon"]}
      alt=""
      src={images.icPublicChannel}
    />
  );
};

export default memo(ChannelIcon);
