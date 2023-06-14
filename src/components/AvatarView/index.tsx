import React, { memo, useCallback, useMemo } from "react";
import images from "common/images";
import { UserData } from "models";
import styles from "./index.module.scss";
import IconUser from "components/SVGs/IconUser";
import { useImage } from "providers/ImageProvider";

type AvatarViewProps = {
  user?: UserData | null;
  size?: number;
  bot?: boolean;
};

const AvatarView = ({ user, size = 25, bot }: AvatarViewProps) => {
  const imageHelper = useImage()
  const handleErrorAvatar = useCallback(
    ({ currentTarget }: React.SyntheticEvent<HTMLImageElement, Event>) => {
      currentTarget.onerror = null; // prevents looping
      currentTarget.src = images.defaultImage;
    },
    []
  );
  const resource = useMemo(() => {
    return imageHelper.normalizeImage(user?.avatar_url, user?.user_id);
  }, [imageHelper, user?.avatar_url, user?.user_id]);
  const renderStatus = useCallback(() => {
    if (bot) {
      return (
        <div className={styles["bot-status"]}>
          <span>bot</span>
        </div>
      );
    }
    if (user?.status) {
      return (
        <div
          className={`${styles.status} ${styles[user.status]} ${
            size < 25 ? styles["status-small"] : ""
          }`}
        />
      );
    }
    return null;
  }, [bot, size, user?.status]);
  const Body = useCallback(
    () => (
      <div className={styles["avatar-view"]}>
        {!user?.avatar_url && !user?.user_id ? (
          <IconUser width={size} height={size} style={{ padding: 4 }} />
        ) : (
          <img
            className={styles["avatar-image"]}
            alt=""
            src={resource}
            style={{ maxWidth: size, width: size, height: size }}
            referrerPolicy="no-referrer"
            onError={handleErrorAvatar}
          />
        )}
        {renderStatus()}
      </div>
    ),
    [
      handleErrorAvatar,
      renderStatus,
      resource,
      size,
      user?.avatar_url,
      user?.user_id,
    ]
  );
  return <Body />;
};

export default memo(AvatarView);
