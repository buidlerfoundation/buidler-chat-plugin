import useAppSelector from "hooks/useAppSelector";
import React, { memo } from "react";
import styles from "./index.module.scss";
import ImageView from "components/ImageView";
import numeral from "numeral";
import IconMore from "components/SVGs/IconMore";
import { useImage } from "providers/ImageProvider";

type CommunityFloatProps = {
  bubbleOpen?: boolean;
};

const CommunityFloat = ({ bubbleOpen }: CommunityFloatProps) => {
  const imageHelper = useImage();
  const community = useAppSelector((state) => state.user.community);
  if (!community || bubbleOpen) return null;
  return (
    <div className={styles.container}>
      <ImageView
        alt=""
        src={imageHelper.normalizeImage(
          community?.team_icon,
          community?.team_id
        )}
        className={styles["community-logo"]}
      />
      <div className={styles["community-info"]}>
        <h1 className="text-xl font-bold text-white truncate">
          {community.team_display_name}
        </h1>
        <h3 className="font-semibold text-secondary" style={{ marginTop: 2 }}>
          {numeral(community?.total_members).format("0[.][0]a")} members
        </h3>
      </div>
      <div className="cursor-pointer">
        <IconMore />
      </div>
    </div>
  );
};

export default memo(CommunityFloat);
