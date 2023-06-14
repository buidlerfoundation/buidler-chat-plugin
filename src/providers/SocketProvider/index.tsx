"use client";
import AppConfig, { AsyncKey } from "common/AppConfig";
import { GeneratedPrivateKey, getCookie, getDeviceCode } from "common/Cookie";
import { utils } from "ethers";
import useAppDispatch from "hooks/useAppDispatch";
import useUser from "hooks/useUser";
import { EmitMessageData } from "models";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useRef,
} from "react";
import { toast } from "react-hot-toast";
import { MESSAGE_ACTIONS } from "reducers/MessageReducers";
import { Socket, io } from "socket.io-client";

export interface ISocketContext {
  emitMessage: (payload: EmitMessageData) => void;
  disconnect: () => void;
  initSocket: (onConnected: () => void) => void;
}

export const SocketContext = createContext<ISocketContext>({
  emitMessage: () => {},
  disconnect: () => {},
  initSocket: () => {},
});

export function useSocket(): ISocketContext {
  return useContext(SocketContext);
}

interface ISocketProps {
  children?: ReactNode;
}

const SocketProvider = ({ children }: ISocketProps) => {
  const socket = useRef<Socket | null>(null);
  const user = useUser();
  const dispatch = useAppDispatch();
  const removeListener = useCallback(() => {
    socket.current?.off("ON_NEW_MESSAGE");
    socket.current?.off("ON_DELETE_MESSAGE");
    socket.current?.off("ON_EDIT_MESSAGE");
  }, []);
  const listener = useCallback(() => {
    socket.current?.on("ON_NEW_MESSAGE", async (data: any) => {
      dispatch(MESSAGE_ACTIONS.newMessage(data.message_data));
    });
    socket.current?.on("ON_DELETE_MESSAGE", async (data: any) => {
      console.log("XXX: delete message", data);
    });
    socket.current?.on("ON_EDIT_MESSAGE", async (data: any) => {
      console.log("XXX: edit message", data);
    });
  }, [dispatch]);
  const initSocket = useCallback(
    async (onConnected: () => void) => {
      if (socket.current?.connected) return;
      const accessToken = await getCookie(AsyncKey.accessTokenKey);
      const deviceCode = await getDeviceCode();
      const generatedPrivateKey = await GeneratedPrivateKey();
      const publicKey = utils.computePublicKey(generatedPrivateKey, true);
      socket.current = io(`${AppConfig.apiBaseUrl}`, {
        query: {
          token: accessToken,
          device_code: deviceCode,
          encrypt_message_key: publicKey,
          platform: "Web",
        },
        transports: ["websocket"],
        upgrade: false,
      });
      socket.current?.on("connect_error", (err) => {
        toast.error(err.message);
      });
      socket.current?.on("connect", () => {
        console.log("socket connected");
        removeListener();
        listener();
        onConnected?.();
      });
    },
    [listener, removeListener]
  );
  const emitMessage = useCallback(
    (payload: EmitMessageData) => {
      // Handle sending message
      const message: any = {
        ...payload,
        createdAt: new Date().toISOString(),
        sender_id: user.user_id,
        isSending: true,
        conversation_data: null,
        content: payload.text,
        plain_text: payload.text,
      }
      dispatch(
        MESSAGE_ACTIONS.emitMessage(message)
      );
      socket.current?.emit("NEW_MESSAGE", payload);
    },
    [dispatch, user.user_id]
  );
  const disconnect = useCallback(() => {
    socket.current?.disconnect();
  }, []);
  return (
    <SocketContext.Provider
      value={{
        emitMessage,
        disconnect,
        initSocket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
