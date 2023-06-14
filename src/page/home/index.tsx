"use client";
import React, { useCallback, useState, useEffect } from "react";
import styles from "./index.module.scss";
import useUser from "hooks/useUser";
import useAppDispatch from "hooks/useAppDispatch";
import ChatBox from "components/ChatBox";
import LoginBottomSheet from "components/LoginBottomSheet";
import { useAuth } from "providers/AuthProvider";
import { getMessages } from "reducers/MessageReducers";
import { setUserCommunityData } from "reducers/UserReducers";

const Panel = () => {
  const dispatch = useAppDispatch();
  const user = useUser();
  const auth = useAuth();
  const [openLogin, setOpenLogin] = useState(false);
  const communityId = "24439d55-3509-4e25-9ff9-362ce2f0a8c2";
  const channelId = "806f7d08-927c-4fe1-9c2f-bd9d442dd9ab";
  const toggleLogin = useCallback(
    () => setOpenLogin((current) => !current),
    []
  );
  const onConnectWalletClick = useCallback(() => {
    if (window.ethereum) {
      auth.loginWithMetaMask();
    } else {
      auth.loginWithWalletConnect();
    }
  }, [auth]);
  useEffect(() => {
    if (openLogin && user.user_id) {
      setOpenLogin(false);
      // Handle login success
    }
  }, [openLogin, user.user_id]);
  useEffect(() => {
    if (channelId && user.user_id) {
      dispatch(getMessages({ channelId }));
    }
  }, [channelId, dispatch, user.user_id]);
  useEffect(() => {
    if (communityId && channelId && user.user_id) {
      dispatch(setUserCommunityData({ communityId, channelId }));
    }
  }, [channelId, communityId, dispatch, user.user_id]);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className={styles.container}>
        {user.user_id && <ChatBox channelId={channelId} />}
        <LoginBottomSheet
          open={openLogin}
          onClose={toggleLogin}
          onConnectWalletClick={onConnectWalletClick}
        />
      </div>
    </main>
  );
};

export default Panel;
