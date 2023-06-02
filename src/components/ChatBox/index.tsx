import React, { memo, useCallback, useState } from "react";
import styles from "./index.module.scss";
import ChatBoxHead from "components/ChatBoxHead";
import ChatBoxBody from "components/ChatBoxBody";
import ChatBoxInput from "components/ChatBoxInput";
import useAppSelector from "hooks/useAppSelector";

const ChatBox = () => {
  const [text, setText] = useState("");
  const channel = useAppSelector(state => state.user.channel)
  const onCircleClick = useCallback(() => {}, []);
  const onKeyDown = useCallback(() => {}, []);
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
        onKeyDown={onKeyDown}
        placeholder={`Message to # ${channel?.channel_name}`}
      />
    </div>
  );
};

export default memo(ChatBox);
