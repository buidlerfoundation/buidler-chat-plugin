import React, { useCallback } from "react";
import api from "../../api";
import images from "../../common/images";
import styles from "./index.module.scss";
import { CircularProgress } from "@mui/material";
import { LocalAttachment } from "models";
import { useImage } from "providers/ImageProvider";

type AttachmentItemProps = {
  attachment: LocalAttachment;
  onRemove: (attachment: LocalAttachment) => void;
  teamId: string;
};

const AttachmentItem = ({
  attachment,
  onRemove,
  teamId,
}: AttachmentItemProps) => {
  const imageHelper = useImage();
  const handleRemoveClick = useCallback(async () => {
    if (!attachment.id) return;
    await api.upload.removeFile(attachment.id);
    onRemove(attachment);
  }, [attachment, onRemove]);
  const renderPreviewAttachment = useCallback(() => {
    const file =
      attachment.file || imageHelper.normalizeImage(attachment.url, teamId);
    if (attachment?.type?.includes("video")) {
      return (
        <video className={styles.image}>
          <source src={file} type="video/mp4" />
        </video>
      );
    }
    return <img alt="" className={styles.image} src={file} />;
  }, [attachment.file, attachment.url, attachment?.type, imageHelper, teamId]);
  if (attachment?.type?.includes("application")) {
    return (
      <div className={styles.container} style={{ width: "100%" }}>
        <div className={styles.file}>
          <img alt="" src={images.icFile} style={{ marginLeft: 20 }} />
          <span style={{ flex: 1, margin: "0 20px" }}>
            {attachment.fileName}
          </span>
        </div>
        {attachment.loading && (
          <div className={styles.loading}>
            <CircularProgress />
          </div>
        )}
        {attachment.id && (
          <div
            className={styles["attachment-delete"]}
            onClick={handleRemoveClick}
          >
            <img
              alt=""
              src={images.icClearText}
              style={{ width: 20, height: 20 }}
            />
          </div>
        )}
      </div>
    );
  }
  return (
    <div className={styles.container}>
      {renderPreviewAttachment()}
      {attachment.loading && (
        <div className={styles.loading}>
          <CircularProgress />
        </div>
      )}
      {attachment.id && (
        <div
          className={styles["attachment-delete"]}
          onClick={handleRemoveClick}
        >
          <img
            alt=""
            src={images.icClearText}
            style={{ width: 20, height: 20 }}
          />
        </div>
      )}
    </div>
  );
};

export default AttachmentItem;
