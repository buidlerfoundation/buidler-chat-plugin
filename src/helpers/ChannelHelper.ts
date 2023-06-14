import { MessageData } from "models";
import { decrypt } from "eciesjs";
import CryptoJS from "crypto-js";

export const normalizePublicMessageItem = (item: MessageData, key: string) => {
  const content = item.content
    ? CryptoJS.AES.decrypt(item.content, key).toString(CryptoJS.enc.Utf8)
    : "";
  if (item?.conversation_data) {
    item.conversation_data = normalizePublicMessageItem(
      item.conversation_data,
      key
    );
  }
  return {
    ...item,
    content,
  };
};

export const normalizePublicMessageData = (
  messages?: MessageData[],
  privateKey?: string,
  encryptMessageKey?: string
) => {
  if (!privateKey) return [];
  const decryptMessageKey = decrypt(
    privateKey,
    Buffer.from(encryptMessageKey || "", "hex")
  );
  const res =
    messages?.map?.((el) =>
      normalizePublicMessageItem(el, decryptMessageKey.toString())
    ) || [];
  return res.filter(
    (el) => !!el.content || el?.message_attachments?.length > 0
  );
};
