import React, { memo, useCallback, useMemo } from "react";
import styles from "./index.module.scss";
import { MessageData, MessageDateData } from "models";
import useMessageData from "hooks/useMessageData";
import { titleMessageFromNow } from "utils/DateUtils";
import { normalizeMessages } from "helpers/MessageHelper";
import MessageItem from "components/MessageItem";
import useAppSelector from "hooks/useAppSelector";
import useAppDispatch from "hooks/useAppDispatch";
import { getMessages } from "reducers/MessageReducers";
import { CircularProgress } from "@mui/material";
import useChannelId from "hooks/useChannelId";

const ChatBoxBody = () => {
  const channelId = useChannelId();
  const messageData = useMessageData();
  const dispatch = useAppDispatch();
  const messages = useMemo(() => messageData?.data || [], [messageData?.data]);
  const canMoreAfter = useMemo(
    () => messageData?.canMoreAfter,
    [messageData?.canMoreAfter]
  );
  const canMore = useMemo(() => messageData?.canMore, [messageData?.canMore]);
  const loadMoreAfter = useAppSelector(
    (state) => state.message.loadMoreAfterMessage
  );
  const loadMore = useAppSelector((state) => state.message.loadMoreMessage);
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
  const onMoreMessage = useCallback(
    (createdAt?: string) => {
      if (!createdAt || loadMore) return;
      dispatch(getMessages({ channelId, before: createdAt }));
    },
    [channelId, dispatch, loadMore]
  );
  const onMessageScroll = useCallback(
    (e: any) => {
      const { scrollTop, scrollHeight, clientHeight } = e.target;
      if (scrollTop === 0 && canMoreAfter && !loadMoreAfter && messages?.[0]) {
        // more after
      } else {
        const compare = Math.round(scrollTop + scrollHeight);
        if (
          (compare === clientHeight + 1 || compare === clientHeight) &&
          canMore &&
          messages
        ) {
          onMoreMessage(messages?.[messages?.length - 1].createdAt);
        }
      }
    },
    [canMore, canMoreAfter, loadMoreAfter, messages, onMoreMessage]
  );
  return (
    <div className={styles.container}>
      {messagesGroup && messagesGroup?.length > 0 && (
        <ol
          id="channel__message-list"
          className={styles["message-list"]}
          onScroll={onMessageScroll}
        >
          {messagesGroup?.map(renderMessage)}
        </ol>
      )}
      {loadMore && (
        <div className={styles["message-load-more"]}>
          <CircularProgress size={30} color="inherit" />
        </div>
      )}
    </div>
  );
};

export default memo(ChatBoxBody);
