import React from "react";
import images from "../../common/images";
import styles from "./index.module.scss";

type VideoLightBoxProps = {
  children: any;
  originalSrc: any;
};

const VideoLightBox = ({ children, originalSrc }: VideoLightBoxProps) => {
  // TODO handle play video with ${originalSrc}
  return (
    <div>
      <div style={{ display: "inline-block", position: "relative" }}>
        {children}
        <div className={styles["ic-play"]}>
          <img src={images.iconVideoPlay} alt="" />
        </div>
      </div>
    </div>
  );
};

export default VideoLightBox;
