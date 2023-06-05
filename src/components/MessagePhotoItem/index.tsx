import React, { useCallback, useMemo } from "react";
import VideoLightBox from "../VideoLightBox";
import { AttachmentData } from "models";
import styles from "./index.module.scss";
import ImageHelper from "common/ImageHelper";
import useCommunityId from "hooks/useCommunityId";
import { CircularProgress } from "@mui/material";
import images from "common/images";
import ImgLightBox from "components/ImgLightBox";

type PhotoItemProps = {
  photo: AttachmentData;
  handleFileClick: (file: AttachmentData) => void;
};

const PhotoItem = ({ photo, handleFileClick }: PhotoItemProps) => {
  const teamId = useCommunityId();
  const handleClick = useCallback(
    () => handleFileClick(photo),
    [handleFileClick, photo]
  );
  const renderLocalFile = useCallback(() => {
    const type = photo.localFile?.type;
    if (type?.includes("video")) {
      return <video className={styles["video"]} src={photo.localFile?.file} />;
    }
    return (
      <img
        className={styles["photo-item"]}
        alt=""
        src={photo.localFile?.file}
      />
    );
  }, [photo.localFile?.file, photo.localFile?.type]);
  if (photo.is_uploaded === false) {
    const type = photo.localFile?.type;
    if (type?.includes("application")) {
      return (
        <div className={styles["file-item"]} style={{ position: "relative" }}>
          <img alt="" src={images.icFile} />
          <span className={styles["file-name"]}>
            {photo.localFile?.fileName}
          </span>
          <div className={styles["attachment-loading"]}>
            <CircularProgress />
          </div>
        </div>
      );
    }
    if (photo.localFile?.file) {
      return (
        <div style={{ position: "relative" }}>
          {renderLocalFile()}
          <div className={styles["attachment-loading"]}>
            <CircularProgress />
          </div>
        </div>
      );
    }
    return (
      <div
        className={styles["photo-item"]}
        style={{ width: "calc((100vh - 50px) / 3)" }}
      />
    );
  }
  if (photo?.mimetype?.includes("application")) {
    return (
      <div className={styles["file-item"]} onClick={handleClick}>
        <img alt="" src={images.icFile} />
        <span className={styles["file-name"]}>{photo.original_name}</span>
        <img alt="" src={images.icDownload} />
      </div>
    );
  }
  if (photo?.mimetype?.includes("video")) {
    return (
      <div style={{ marginTop: 10, marginRight: 10 }}>
        <VideoLightBox
          className={styles["video"]}
          originalSrc={ImageHelper.normalizeImage(photo.file_url, teamId, {
            fm: "mp4",
          })}
        >
          <img
            className={styles["video"]}
            src={ImageHelper.normalizeImage(
              photo.file_url?.replace(/\..*$/g, "_thumbnail.png"),
              teamId
            )}
            alt=""
          />
        </VideoLightBox>
      </div>
    );
  }
  return (
    <ImgLightBox
      originalSrc={ImageHelper.normalizeImage(photo.file_url, teamId)}
    >
      <img
        className={styles["photo-item"]}
        alt=""
        src={ImageHelper.normalizeImage(photo.file_url, teamId, {
          h: Math.round((window.innerHeight - 50) / 3),
        })}
      />
    </ImgLightBox>
  );
};

type MessagePhotoItemProps = {
  photos: AttachmentData[];
  isHead?: boolean;
  isMore?: boolean;
};

const MessagePhotoItem = ({
  photos,
  isHead,
  isMore,
}: MessagePhotoItemProps) => {
  const teamId = useCommunityId();
  const handleFileClick = useCallback(
    (photo: AttachmentData) => {
      window.open(
        ImageHelper.normalizeImage(photo.file_url, teamId || "", {}, true),
        "_blank"
      );
    },
    [teamId]
  );
  const morePhoto = useMemo(() => {
    if (isMore) return photos.length - 1;
    return 0;
  }, [isMore, photos.length]);
  const attachmentData = useMemo(() => {
    if (isMore) return photos.slice(0, 2);
    return photos;
  }, [isMore, photos]);
  const renderPhoto = useCallback(
    (photo: AttachmentData, index: number) => (
      <div className={styles["photo__wrap"]} key={`${photo?.file_id}`}>
        <PhotoItem
          photo={photo}
          handleFileClick={handleFileClick}
        />
        {morePhoto > 1 && index === attachmentData.length - 1 && (
          <div className={styles["photo-more"]}>+{morePhoto - 1}</div>
        )}
      </div>
    ),
    [attachmentData.length, handleFileClick, morePhoto]
  );
  if (!teamId) return null;
  return (
    <div
      className={styles["message-photo-container"]}
      style={{ marginLeft: isHead ? 20 : 0 }}
    >
      {attachmentData.map(renderPhoto)}
    </div>
  );
};

export default MessagePhotoItem;
