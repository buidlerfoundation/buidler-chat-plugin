import React, { memo, useCallback, useMemo } from "react";
import styles from "./index.module.scss";
import { MessageData, MessageDateData } from "models";
import useMessageData from "hooks/useMessageData";
import { titleMessageFromNow } from "utils/DateUtils";
import { normalizeMessages } from "helpers/MessageHelper";
import MessageItem from "components/MessageItem";

interface IChatBoxBody {
  channelId?: string;
}

const ChatBoxBody = ({channelId}: IChatBoxBody) => {
  const messageData = useMessageData(channelId);
  const messages = useMemo(() => messageData?.data || [], [messageData?.data]);
  const messagesGroup = useMemo<Array<
    MessageData | MessageDateData
  > | null>(() => {
    if (!messages) return null;
    return normalizeMessages(messages);
  }, [messages]);
  const renderMessage = useCallback((msg: any) => {
    if (msg.type === "date") {
      return (
        <li className={styles["date-title"]} key={msg.value}>
          <div className={styles["separate-line"]} />
          <span>{titleMessageFromNow(msg.value)}</span>
          <div className={styles["separate-line"]} />
          <div />
        </li>
      );
    }
    return <MessageItem key={msg.message_id} message={msg} />;
  }, []);
  return (
    <div className={styles.container}>
      {messagesGroup && messagesGroup?.length > 0 && (
        <ol id="channel__message-list" className={styles["message-list"]}>
          {messagesGroup?.map(renderMessage)}
        </ol>
      )}
    </div>
  );
};

export default memo(ChatBoxBody);
