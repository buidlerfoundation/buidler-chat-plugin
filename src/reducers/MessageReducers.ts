import { AnyAction, Reducer } from "redux";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { MessageData } from "models";
import { logoutAction } from "./UserReducers";
import { PayloadMessageListAction } from "models/MessageAction";
import { normalizeMessage } from "helpers/MessageHelper";

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
          state.messageData[message.entity_id].data = state.messageData[
            message.entity_id
          ].data.map((el) => {
            if (el.message_id === message.message_id) {
              return message;
            }
            return el;
          });
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
    builder.addCase(logoutAction, () => initialState);
  },
});

export const MESSAGE_ACTIONS = messageSlice.actions;

export default messageSlice.reducer;
