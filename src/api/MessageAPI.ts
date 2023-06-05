import { MessageData } from "models";
import Caller from "./Caller";
import { getDeviceCode } from "common/Cookie";

const MessageAPI = {
  list: async (
    channelId: string,
    limit = 50,
    before?: string,
    after?: string,
    controller?: AbortController
  ) => {
    const deviceCode = await getDeviceCode();
    let uri = `messages/${channelId}?page[size]=${limit}&device_code=${deviceCode}`;
    if (after) {
      if (before) {
        uri += `&page[before]=${before}`;
      }
      uri += `&page[after]=${after}`;
    } else {
      uri += `&page[before]=${before || new Date().toISOString()}`;
    }
    return Caller.get<MessageData[]>(uri, undefined, controller);
  },
  edit: (
    id: string,
    content: string,
    plain_text: string,
    file_ids?: string[]
  ) => {
    return Caller.put(`message/${id}`, {
      content,
      mentions: getMentionData(content),
      plain_text,
      file_ids,
    });
  },
  getAround: async (messageId: string, limit = 20) => {
    const deviceCode = await getDeviceCode();
    return Caller.get<MessageData[]>(
      `messages/${messageId}/jump?device_code=${deviceCode}&limit=${limit}`
    );
  },
  upVoteScam: (id) => Caller.post(`scam-alert/${id}/upvote`),
  downVoteScam: (id) => Caller.post(`scam-alert/${id}/downvote`),
};

export default MessageAPI;
