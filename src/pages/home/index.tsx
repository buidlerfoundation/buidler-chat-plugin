"use client";
import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  CSSProperties,
} from "react";
import IconBubble from "components/SVGs/IconBubble";
import useAppDispatch from "hooks/useAppDispatch";
import api from "api";
import { USER_ACTIONS } from "reducers/UserReducers";
import CommunityFloat from "components/CommunityFloat";
import useUser from "hooks/useUser";
import { useAuth } from "components/AuthProvider";
import LoginBottomSheet from "components/LoginBottomSheet";
import ChatBox from "components/ChatBox";
import useCommunityId from "hooks/useCommunityId";

export default function Home() {
  const dispatch = useAppDispatch();
  const user = useUser();
  const auth = useAuth();
  const [openLogin, setOpenLogin] = useState(false);
  const communityId = useCommunityId();
  const toggleLogin = useCallback(
    () => setOpenLogin((current) => !current),
    []
  );
  useEffect(() => {
    if (communityId) {
      api.community.byId(communityId).then((res) => {
        if (res.success) {
          const community = res.data;
          if (community) {
            community.total_members = res.metadata?.total_members;
            community.total_online_members = res.metadata?.total_online_members;
            dispatch(USER_ACTIONS.updateCommunity(community));
          }
        }
      });
    }
  }, [communityId, dispatch]);
  const [open, setOpen] = useState(false);
  const [style, setStyle] = useState<CSSProperties>({
    width: "100%",
    height: 0,
  });
  const toggle = useCallback(() => setOpen((current) => !current), []);
  useEffect(() => {
    if (open) {
      setStyle({
        width: "100%",
        height: "100%",
      });
      window.parent.postMessage("open-plugin", "*");
    } else {
      setTimeout(() => {
        setStyle({ width: "100%", height: 0 });
        window.parent.postMessage("close-plugin", "*");
      }, 290);
    }
  }, [open, user.user_id]);
  useEffect(() => {
    if (openLogin && user.user_id) {
      setOpenLogin(false);
      // Handle login success
    }
  }, [openLogin, user.user_id]);
  const onBubbleClick = useCallback(() => {
    if (!user.user_id && !open) {
      setOpenLogin(true);
    }
    if (openLogin) {
      setOpenLogin(false);
    }
    toggle();
  }, [open, openLogin, toggle, user.user_id]);
  const onConnectWalletClick = useCallback(() => {
    if (window.ethereum) {
      auth.loginWithMetaMask();
    } else {
      auth.loginWithWalletConnect();
    }
  }, [auth]);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="b-root-chat">
        <div className="b-chat__wrapper">
          <div
            className={`b-chat-box__wrapper ${
              open ? "b-bounce-in" : "b-bounce-out"
            }`}
            style={style}
          >
            <div className="b-chat-box">
              {user.user_id && <ChatBox />}
              <LoginBottomSheet
                open={openLogin}
                onClose={toggleLogin}
                onConnectWalletClick={onConnectWalletClick}
              />
            </div>
          </div>
          <CommunityFloat bubbleOpen={open} />
        </div>
        <div className="b-bubble__wrap normal-button" onClick={onBubbleClick}>
          <IconBubble />
        </div>
      </div>
    </main>
  );
}
