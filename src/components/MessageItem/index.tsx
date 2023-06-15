import { MessageData, UserData } from "models";
import React, { memo, useCallback, useMemo } from "react";
import styles from "./index.module.scss";
import AvatarView from "components/AvatarView";
import { dateFormatted, messageFromNow } from "utils/DateUtils";
import {
  normalizeMessageTextPlain,
  normalizeUserName,
} from "helpers/MessageHelper";
import { normalizeMessageText } from "helpers/MessageHelper";
import MessagePhotoItem from "components/MessagePhotoItem";

type MessageItemProps = {
  message: MessageData;
  isHighlight?: boolean;
  disableHover?: boolean;
};

const MessageItem = ({
  message,
  isHighlight,
  disableHover,
}: MessageItemProps) => {
  const isBot = useMemo(() => !!message.metadata, [message.metadata]);
  const sender = useMemo<UserData>(
    () => ({
      user_id: message.sender_id,
      user_name: normalizeUserName(message.sender_id),
      avatar_url: "",
    }),
    [message.sender_id]
  );
  const showAvatar = useMemo(() => {
    return message.isHead || !!message.task || !!message.reply_message_id;
  }, [message.isHead, message.task, message.reply_message_id]);
  const renderSpaceLeft = useCallback(() => {
    if (showAvatar) return null;
    if (!disableHover) {
      return (
        <div className={styles["space-left"]}>
          <span className={styles["item__time"]}>
            {dateFormatted(message.createdAt, "HH:mm A")}
          </span>
        </div>
      );
    }
    return <div className={styles["space-left"]} />;
  }, [disableHover, message.createdAt, showAvatar]);
  const renderMessageContentType = useCallback(() => {
    if (message.metadata?.type === "scam_alert") {
      return (
        <span className={styles["item__content-type"]}>
          {message.metadata?.data?.content}
        </span>
      );
    }
    return null;
  }, [message.metadata?.data?.content, message.metadata?.type]);
  const renderContent = useCallback(() => {
    // if (message.task) {
    //   // render pin post
    //   return null;
    // }
    return (
      <div
        className={`${styles["item__message"]} ${
          showAvatar ? styles["head__message"] : ""
        } ${message.isSending ? styles["item-sending"] : ""} ${
          isBot ? styles["item-bot"] : ""
        }`}
        dangerouslySetInnerHTML={{
          __html: message?.is_scam_detected
            ? normalizeMessageTextPlain(message.content, true)
            : normalizeMessageText(
                message.content,
                undefined,
                undefined,
                !message.isSending && message.createdAt !== message.updatedAt
              ),
        }}
      />
    );
  }, [
    isBot,
    message.content,
    message.createdAt,
    message.isSending,
    message?.is_scam_detected,
    message.updatedAt,
    showAvatar,
  ]);
  const renderPhoto = useCallback(() => {
    if (message.task) return null;
    return (
      <MessagePhotoItem
        photos={message?.message_attachments || []}
        isHead={showAvatar}
      />
    );
  }, [message?.message_attachments, message.task, showAvatar]);
  return (
    <li className={styles.container} id={message.message_id}>
      {showAvatar && <div style={{ height: 15 }} />}
      <div
        className={`${styles["item__wrap"]} ${
          isHighlight ? styles["item-highlight"] : ""
        }`}
      >
        {/* Render reply */}
        <div className={styles["item__container"]}>
          {showAvatar && (
            <div className={styles["avatar-view"]}>
              <AvatarView user={sender} size={35} bot={isBot} />
            </div>
          )}
          {renderSpaceLeft()}
          <div className={styles["item__content"]}>
            {showAvatar && (
              <div className={styles["item__user"]}>
                <span className={`${styles["user-name"]} truncate`}>
                  {sender?.user_name}
                </span>
                <span
                  className={styles["item__time"]}
                  style={{
                    marginLeft: 5,
                    display: "block",
                    lineHeight: "17px",
                  }}
                >
                  {messageFromNow(message.createdAt)}
                </span>
              </div>
            )}
            {renderMessageContentType()}
            {renderContent()}
            {renderPhoto()}
          </div>
        </div>
      </div>
    </li>
  );
};

export default memo(MessageItem);
