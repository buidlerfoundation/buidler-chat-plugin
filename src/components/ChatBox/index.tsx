import React, { memo, useCallback, useRef, useState } from "react";
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
import { debounce } from "lodash";
import { EmitMessageData, LocalAttachment } from "models";
import { getUniqueId } from "helpers/GenerateUUID";
import { useSocket } from "providers/SocketProvider";
import { useDropzone } from "react-dropzone";
import api from "api";
import useCommunityId from "hooks/useCommunityId";

const ChatBox = () => {
  const [text, setText] = useState("");
  const generateId = useRef<string>("");
  const communityId = useCommunityId();
  const [files, setFiles] = useState<Array<LocalAttachment>>([]);
  const channel = useAppSelector((state) => state.user.channel);
  const socket = useSocket();
  const submitMessage = useCallback(() => {
    if (!text.trim()) return;
    const message: EmitMessageData = {
      content: extractContentMessage(text.trim()),
      plain_text: extractContent(text),
      mentions: getMentionData(text.trim()),
      text,
      entity_type: "channel",
      entity_id: channel?.channel_id,
    };
    if (files.length > 0) {
      message.file_ids = files.map((el) => el.randomId || "");
      message.files = files;
    }
    if (files.length > 0) {
      message.message_id = generateId.current;
    } else {
      message.message_id = getUniqueId();
    }
    socket.emitMessage(message);
    setText("");
    setFiles([]);
    generateId.current = "";
  }, [channel?.channel_id, files, socket, text]);
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
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (generateId.current === "") {
        generateId.current = getUniqueId();
      }
      const data = [...acceptedFiles];
      data.forEach((f) => {
        const attachment: LocalAttachment = {
          file: URL.createObjectURL(f),
          randomId: getUniqueId(),
          loading: true,
          type: f.type || "application",
          fileName: f.name,
          attachmentId: generateId.current,
        };
        setFiles((current) => [...current, attachment]);
        api.upload
          .uploadFile(
            communityId,
            generateId.current,
            f,
            "channel",
            attachment.randomId
          )
          .then((res) => {
            setFiles((current) => {
              let newAttachments = [...current];
              if (res.statusCode === 200) {
                const index = newAttachments.findIndex(
                  (a: any) => a.randomId === attachment.randomId
                );
                newAttachments[index] = {
                  ...newAttachments[index],
                  loading: false,
                  url: res.data?.file_url,
                  id: res.data?.file.file_id,
                };
              } else {
                newAttachments = newAttachments.filter(
                  (el) => el.randomId !== attachment.randomId
                );
              }

              return newAttachments;
            });
            return null;
          })
          .catch((err) => console.log(err));
      });
    },
    [communityId]
  );
  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    noClick: true,
  });
  const onCircleClick = useCallback(() => {
    open?.();
  }, [open]);
  const onRemoveFile = useCallback((file: LocalAttachment) => {
    setFiles((current) => current.filter((f) => f.id !== file.id));
  }, []);
  return (
    <div className={styles.container} {...getRootProps()}>
      <ChatBoxHead />
      <ChatBoxBody />
      <ChatBoxInput
        text={text}
        setText={setText}
        onCircleClick={onCircleClick}
        onPaste={onPaste}
        onKeyDown={debounce(onKeyDown, 100)}
        placeholder={`Message to # ${channel?.channel_name}`}
        attachments={files}
        onRemoveFile={onRemoveFile}
      />
      <input {...getInputProps()} />
    </div>
  );
};

export default memo(ChatBox);
