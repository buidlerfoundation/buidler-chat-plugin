import React, { memo, useCallback, useState } from "react";
import styles from "./index.module.scss";
import ChatBoxHead from "components/ChatBoxHead";
import ChatBoxBody from "components/ChatBoxBody";
import ChatBoxInput from "components/ChatBoxInput";
import useAppSelector from "hooks/useAppSelector";
import {
  extractContent,
  extractContentMessage,
  getMentionData,
} from "helpers/MessageHelper";
import { useSocket } from "components/SocketProvider";
import { debounce } from "lodash";
import { EmitMessageData } from "models";
import { getUniqueId } from "helpers/GenerateUUID";

const ChatBox = () => {
  const [text, setText] = useState("");
  const channel = useAppSelector((state) => state.user.channel);
  const socket = useSocket();
  const onCircleClick = useCallback(() => {}, []);
  const submitMessage = useCallback(() => {
    if (!text.trim()) return;
    const message: EmitMessageData = {
      content: extractContentMessage(text.trim()),
      plain_text: extractContent(text),
      mentions: getMentionData(text.trim()),
      text,
      entity_type: "channel",
      entity_id: channel?.channel_id,
      message_id: getUniqueId(),
    };
    socket.emitMessage(message);
    setText("");
  }, [channel?.channel_id, socket, text]);
  const onKeyDown = useCallback(
    (e: any) => {
      if (e.code === "Enter" && !e.shiftKey) {
        e.preventDefault();
        submitMessage();
      }
    },
    [submitMessage]
  );
  const onPaste = useCallback(() => {}, []);
  return (
    <div className={styles.container}>
      <ChatBoxHead />
      <ChatBoxBody />
      <ChatBoxInput
        text={text}
        setText={setText}
        onCircleClick={onCircleClick}
        onPaste={onPaste}
        onKeyDown={debounce(onKeyDown, 100)}
        placeholder={`Message to # ${channel?.channel_name}`}
      />
    </div>
  );
};

export default memo(ChatBox);
