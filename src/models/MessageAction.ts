import { MessageData } from "models"

export type PayloadMessageListAction = {
  data: MessageData[];
  channelId: string;
  before?: string;
  after?: string;
  canMoreAfter?: boolean;
  canMoreBefore?: boolean;
  messageId?: string;
}