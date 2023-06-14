import React, { memo } from "react";
import images from "common/images";
import { Channel } from "models";
import useCommunityId from "hooks/useCommunityId";
import styles from "./index.module.scss";
import { useImage } from "providers/ImageProvider";

type ChannelIconProps = {
  channel?: Channel;
};

const ChannelIcon = ({ channel }: ChannelIconProps) => {
  const imageHelper = useImage();
  const communityId = useCommunityId();
  if (!channel) return null;
  if (channel?.channel_image_url) {
    return (
      <img
        className={styles["channel-icon"]}
        src={imageHelper.normalizeImage(
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
