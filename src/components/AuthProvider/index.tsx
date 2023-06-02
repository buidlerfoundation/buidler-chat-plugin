"use client";
import api from "api";
import { AsyncKey, LoginType } from "common/AppConfig";
import { clearData, getCookie, setCookie } from "common/Cookie";
import ImageHelper from "common/ImageHelper";
import { ethers, utils } from "ethers";
import useAppDispatch from "hooks/useAppDispatch";
import useChannelId from "hooks/useChannelId";
import useCommunityId from "hooks/useCommunityId";
import { useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "react-hot-toast";
import { NETWORK_ACTIONS } from "reducers/NetworkReducers";
import { logoutAction, USER_ACTIONS } from "reducers/UserReducers";
import ChainId from "services/connectors/ChainId";
import MetamaskUtils from "services/connectors/MetamaskUtils";
import WalletConnectUtils from "services/connectors/WalletConnectUtils";
import Web3AuthUtils from "services/connectors/Web3AuthUtils";

export interface IAuthContext {
  loginWithMetaMask: () => Promise<void>;
  loginWithWalletConnect: () => Promise<void>;
  loginWithWeb3Auth: () => Promise<void>;
  logout: () => Promise<void>;
  loadingWeb3Auth: boolean;
}

export const AuthContext = createContext<IAuthContext>({
  loginWithMetaMask: async () => {},
  loginWithWalletConnect: async () => {},
  loginWithWeb3Auth: async () => {},
  logout: async () => {},
  loadingWeb3Auth: false,
});

export function useAuth(): IAuthContext {
  return useContext(AuthContext);
}

interface IAuthProps {
  children?: ReactNode;
  isPrivate?: boolean;
}

const AuthProvider = ({ children, isPrivate }: IAuthProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [loadingWeb3Auth, setLoadingWeb3Auth] = useState(false);
  const communityId = useCommunityId();
  const channelId = useChannelId();
  const ott = useMemo(
    () => router.query?.ott?.toString?.(),
    [router.query?.ott]
  );
  const dispatch = useAppDispatch();
  const getInitial = useCallback(async () => {
    const res = await api.user.getInitial();
    if (res.statusCode === 200) {
      ImageHelper.initial(
        res.data?.imgproxy.domain,
        res.data?.imgproxy.bucket_name
      );
      dispatch(USER_ACTIONS.initial(res.data));
    }
  }, [dispatch]);
  const initialChannelData = useCallback(async () => {
    if (!communityId || !channelId) return;
    const channelRes = await api.channel.list(communityId);
    const channel = channelRes?.data?.find((el) => el.channel_id === channelId);
    dispatch(USER_ACTIONS.updateCurrentChannel(channel));
  }, [channelId, communityId, dispatch]);
  const initialUserData = useCallback(async () => {
    const userRes = await api.user.me();
    if (userRes.statusCode === 200) {
      dispatch(
        USER_ACTIONS.updateCurrentUser({
          user: userRes.data,
        })
      );
      initialChannelData();
    } else {
      dispatch(logoutAction());
      if (isPrivate) {
        router.replace("/started");
      }
    }
  }, [dispatch, initialChannelData, isPrivate, router]);
  const handleResponseVerify = useCallback(
    async (res: any, loginType: string) => {
      dispatch(USER_ACTIONS.updateCurrentToken(res?.token));
      await setCookie(AsyncKey.accessTokenKey, res?.token);
      await setCookie(AsyncKey.loginType, loginType);
      await setCookie(AsyncKey.refreshTokenKey, res?.refresh_token);
      await setCookie(AsyncKey.tokenExpire, res?.token_expire_at);
      await setCookie(
        AsyncKey.refreshTokenExpire,
        res?.refresh_token_expire_at
      );
      await initialUserData();
    },
    [dispatch, initialUserData]
  );
  const checkingAuth = useCallback(async () => {
    setLoading(true);
    await getInitial();
    const accessToken = await getCookie(AsyncKey.accessTokenKey);
    if (ott) {
      const res = await api.user.generateTokenFromOTT(ott);
      if (res.success) {
        handleResponseVerify(res.data, LoginType.OTT);
      } else if (isPrivate) {
        router.replace("/started");
      }
    } else if (!accessToken) {
      dispatch(logoutAction());
      if (isPrivate) {
        router.replace("/started");
      }
    } else {
      await initialUserData();
    }
    setLoading(false);
  }, [
    dispatch,
    getInitial,
    handleResponseVerify,
    initialUserData,
    isPrivate,
    ott,
    router,
  ]);
  useEffect(() => {
    checkingAuth();
  }, [checkingAuth]);

  const doingMetamaskLogin = useCallback(
    async (address: string) => {
      try {
        const nonceRes = await api.user.requestNonceWithAddress(address);
        const message = nonceRes.data?.message;
        if (nonceRes.statusCode !== 200 || !message) {
          return false;
        }
        const metamaskProvider: any = window.ethereum;
        const provider = new ethers.providers.Web3Provider(metamaskProvider);
        const signer = provider.getSigner();
        const signature = await signer.signMessage(message);
        const res = await api.user.verifyNonce(message, signature);
        if (res.statusCode === 200) {
          await handleResponseVerify(res, LoginType.MetaMask);
          return true;
        }
        return false;
      } catch (error: any) {
        return false;
      }
    },
    [handleResponseVerify]
  );
  const metamaskDisconnect = useCallback(() => {}, []);
  const onMetamaskUpdate = useCallback(
    (data: any) => {
      if (typeof data === "string") {
        dispatch(NETWORK_ACTIONS.switchNetwork(parseInt(data)));
      } else if (data.length === 0) {
        metamaskDisconnect();
      } else if (data.length > 0) {
        dispatch(NETWORK_ACTIONS.setMetaMaskAccount(data[0]));
      }
    },
    [dispatch, metamaskDisconnect]
  );
  const metamaskConnected = useCallback(() => {
    const chainId =
      window.ethereum?.chainId ||
      window.ethereum?.networkVersion ||
      process.env.NEXT_PUBLIC_CHAIN_ID ||
      `${ChainId.EthereumMainnet}`;
    const account = window.ethereum?.selectedAddress || "";
    dispatch(NETWORK_ACTIONS.setMetaMaskAccount(account));
    dispatch(NETWORK_ACTIONS.switchNetwork(chainId));
  }, [dispatch]);

  const loginWithMetaMask = useCallback(async () => {
    if (!window.ethereum) {
      toast.error("Please install MetaMask extension!");
    } else {
      try {
        const res: any = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const success = await doingMetamaskLogin(res?.[0]);
        if (success) {
          MetamaskUtils.init(
            metamaskDisconnect,
            onMetamaskUpdate,
            metamaskConnected
          );
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  }, [
    doingMetamaskLogin,
    metamaskConnected,
    metamaskDisconnect,
    onMetamaskUpdate,
  ]);
  const doingWCLogin = useCallback(async () => {
    if (
      !WalletConnectUtils.connector ||
      !WalletConnectUtils.connector?.connected
    )
      return;
    try {
      const { accounts } = WalletConnectUtils.connector;
      const address = accounts?.[0];
      const nonceRes = await api.user.requestNonceWithAddress(address);
      const message = nonceRes.data?.message;
      if (nonceRes.statusCode !== 200 || !message) {
        return;
      }
      const params = [
        utils.hexlify(ethers.utils.toUtf8Bytes(message)),
        address,
      ];
      const signature = await WalletConnectUtils.connector.signPersonalMessage(
        params
      );
      const res = await api.user.verifyNonce(message, signature);
      if (res.statusCode === 200) {
        await handleResponseVerify(res, LoginType.WalletConnect);
      } else {
        WalletConnectUtils.connector.killSession();
      }
    } catch (err: any) {
      console.log(err);
      WalletConnectUtils.connector.killSession();
    }
  }, [handleResponseVerify]);
  const onWCConnected = useCallback(() => {
    setTimeout(doingWCLogin, 300);
  }, [doingWCLogin]);
  const onDisconnected = useCallback(async () => {}, []);
  const loginWithWalletConnect = useCallback(async () => {
    WalletConnectUtils.connect(onWCConnected, onDisconnected);
  }, [onDisconnected, onWCConnected]);
  const loginWithWeb3Auth = useCallback(async () => {
    setLoadingWeb3Auth(true);
    try {
      await Web3AuthUtils.init();
      if (!Web3AuthUtils.web3auth) return;
      const web3authProvider = await Web3AuthUtils.web3auth.connect();
      if (!web3authProvider) return;
      Web3AuthUtils.provider = new ethers.providers.Web3Provider(
        web3authProvider
      );
      const signer = Web3AuthUtils.provider.getSigner();
      const address = await signer.getAddress();
      const nonceRes = await api.user.requestNonceWithAddress(address);
      const message = nonceRes.data?.message;
      if (nonceRes.statusCode !== 200 || !message) {
        return;
      }
      const signature = await signer.signMessage(message);
      const res = await api.user.verifyNonce(message, signature);
      if (res.statusCode === 200) {
        await handleResponseVerify(res, LoginType.Web3Auth);
      }
    } catch (error: any) {
      console.log(error);
    }
    setLoadingWeb3Auth(false);
  }, [handleResponseVerify]);
  const logout = useCallback(async () => {
    clearData();
    dispatch(logoutAction());
  }, [dispatch]);
  return (
    <AuthContext.Provider
      value={{
        loginWithMetaMask,
        loginWithWalletConnect,
        loginWithWeb3Auth,
        logout,
        loadingWeb3Auth,
      }}
    >
      {loading && <div />}
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
