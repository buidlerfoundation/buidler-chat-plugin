import React, { memo, useCallback } from "react";
import styles from "./index.module.scss";
import images from "common/images";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";

type ChatBoxInputProps = {
  onCircleClick: () => void;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  onPaste?: (e: React.ClipboardEvent<HTMLDivElement>) => void;
  placeholder: string;
};

const ChatBoxInput = ({
  onCircleClick,
  text,
  setText,
  onKeyDown,
  onPaste,
  placeholder,
}: ChatBoxInputProps) => {
  const handleChangeText = useCallback(
    (e: ContentEditableEvent) => {
      const value = e.target.value
        .replace(/<div><br><\/div>/gim, "<br>")
        .replace(/<div>(.*?)<\/div>/gim, "<br>$1");
      setText(value);
    },
    [setText]
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
          html={text}
          onKeyDown={onKeyDown}
          onChange={handleChangeText}
          placeholder={placeholder}
          className={styles.input}
          onPaste={onPaste}
        />
      </div>
    </div>
  );
};

export default memo(ChatBoxInput);
