import React, { memo, useCallback, useEffect } from "react";
import styles from "./index.module.scss";
import images from "common/images";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { LocalAttachment } from "models";
import useCommunityId from "hooks/useCommunityId";
import AttachmentItem from "components/AttachmentItem";

type ChatBoxInputProps = {
  onCircleClick: () => void;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  onPaste?: (e: React.ClipboardEvent<HTMLDivElement>) => void;
  placeholder: string;
  attachments?: LocalAttachment[];
  onRemoveFile: (attachment: LocalAttachment) => void;
};

const ChatBoxInput = ({
  onCircleClick,
  text,
  setText,
  onKeyDown,
  onPaste,
  placeholder,
  onRemoveFile,
  attachments,
}: ChatBoxInputProps) => {
  const communityId = useCommunityId();
  const handleChangeText = useCallback(
    (e: ContentEditableEvent) => {
      const value = e.target.value
        .replace(/<div><br><\/div>/gim, "<br>")
        .replace(/<div>(.*?)<\/div>/gim, "<br>$1");
      setText(value);
    },
    [setText]
  );
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" && !e.metaKey && !e.shiftKey) e.preventDefault();
    },
    []
  );
  useEffect(() => {
    const keyDownListener = (e: any) => {
      if (e.target.id === "message-input") {
        onKeyDown?.(e);
      }
    };
    window.addEventListener("keydown", keyDownListener);
    return () => {
      window.removeEventListener("keydown", keyDownListener);
    };
  }, [onKeyDown, text]);
  const renderAttachment = useCallback(
    (attachment: LocalAttachment, index: number) => {
      return (
        <AttachmentItem
          attachment={attachment}
          key={attachment.randomId || attachment.id || index}
          onRemove={onRemoveFile}
          teamId={communityId}
        />
      );
    },
    [communityId, onRemoveFile]
  );
  return (
    <div className={styles.container}>
      <div
        className={styles["input-container"]}
        style={{
          backgroundColor: "var(--color-highlight-action)",
        }}
      >
        <div
          className={`${styles["plus-icon"]} cursor-pointer ml-2.5`}
          onClick={onCircleClick}
        >
          <img alt="" src={images.icPlusCircle} />
        </div>
        {text.length === 0 && (
          <div className={`truncate ${styles.placeholder}`}>{placeholder}</div>
        )}
        <ContentEditable
          id="message-input"
          html={text}
          onKeyDown={handleKeyDown}
          onChange={handleChangeText}
          placeholder={placeholder}
          className={styles.input}
          onPaste={onPaste}
        />
      </div>
      {attachments && attachments.length > 0 && (
        <div className={styles["attachment-container"]}>
          {attachments.map(renderAttachment)}
        </div>
      )}
    </div>
  );
};

export default memo(ChatBoxInput);
