import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { MessageData } from "models";
import { logoutAction } from "./UserReducers";
import { PayloadMessageListAction } from "models/MessageAction";
import { normalizeMessage } from "helpers/MessageHelper";
import { GeneratedPrivateKey } from "common/Cookie";
import api from "api";
import { normalizePublicMessageData } from "helpers/ChannelHelper";

interface MessageState {
  messageData: {
    [key: string]: {
      canMore: boolean;
      data: MessageData[];
      canMoreAfter: boolean;
    };
  };
  apiController?: AbortController | null;
  highlightMessageId?: string;
  loadMoreAfterMessage?: boolean;
}

const initialState: MessageState = {
  messageData: {},
  apiController: null,
};

export const getMessages = createAsyncThunk(
  "message/get",
  async (payload: { channelId: string }) => {
    const { channelId } = payload;
    const privateKey = await GeneratedPrivateKey();
    const messageRes = await api.message.list(channelId);
    if (messageRes.statusCode === 200) {
      const messageData = normalizePublicMessageData(
        messageRes.data,
        privateKey,
        messageRes.metadata?.encrypt_message_key
      );
      return {
        channelId,
        data: messageData,
      };
    }
  }
);

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    updateList: (
      state: MessageState,
      action: PayloadAction<PayloadMessageListAction>
    ) => {
      const {
        data,
        after,
        before,
        channelId,
        canMoreBefore,
        canMoreAfter,
        messageId,
      } = action.payload;
      let msg = data;
      if (!after && (before || data.length === 0)) {
        msg = [...currentData, ...data];
      } else if (after || data.length === 0) {
        msg = [...data, ...currentData];
      }
      state.messageData[channelId] = {
        data: normalizeMessage(msg),
        canMore:
          canMoreBefore !== undefined
            ? canMoreBefore
            : !after
            ? data.length !== 0
            : state.messageData?.[channelId]?.canMore,
        canMoreAfter:
          canMoreAfter !== undefined
            ? canMoreAfter
            : messageId
            ? true
            : after
            ? data.length !== 0
            : before
            ? state.messageData?.[channelId]?.canMoreAfter
            : false,
      };
    },
    emitMessage: (state: MessageState, action: PayloadAction<MessageData>) => {
      const message = action.payload;
      if (
        message.entity_type === "channel" &&
        state.messageData?.[message.entity_id]
      ) {
        state.messageData[message.entity_id].data = normalizeMessage([
          message,
          ...state.messageData[message.entity_id].data,
        ]);
      }
    },
    newMessage: (state: MessageState, action: PayloadAction<MessageData>) => {
      const message = action.payload;
      if (
        message.entity_type === "channel" &&
        state.messageData?.[message.entity_id]
      ) {
        const isExited = !!state.messageData[message.entity_id]?.data?.find?.(
          (el) => el.message_id === message.message_id
        );
        if (isExited) {
          state.messageData[message.entity_id].data = normalizeMessage(
            state.messageData[message.entity_id].data.map((el) => {
              if (el.message_id === message.message_id) {
                return message;
              }
              return el;
            })
          );
        } else {
          state.messageData[message.entity_id].data = normalizeMessage([
            message,
            ...state.messageData[message.entity_id].data,
          ]);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logoutAction, () => initialState)
      .addCase(getMessages.fulfilled, (state: MessageState, action) => {
        const {
          data,
          after,
          before,
          channelId,
          canMoreBefore,
          canMoreAfter,
          messageId,
        } = action.payload;
        let msg = data;
        if (!after && (before || data.length === 0)) {
          msg = [...currentData, ...data];
        } else if (after || data.length === 0) {
          msg = [...data, ...currentData];
        }
        state.messageData[channelId] = {
          data: normalizeMessage(msg),
          canMore:
            canMoreBefore !== undefined
              ? canMoreBefore
              : !after
              ? data.length !== 0
              : state.messageData?.[channelId]?.canMore,
          canMoreAfter:
            canMoreAfter !== undefined
              ? canMoreAfter
              : messageId
              ? true
              : after
              ? data.length !== 0
              : before
              ? state.messageData?.[channelId]?.canMoreAfter
              : false,
        };
      });
  },
});

export const MESSAGE_ACTIONS = messageSlice.actions;

export default messageSlice.reducer;
