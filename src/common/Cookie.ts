import { getUniqueId } from "helpers/GenerateUUID";
import { AsyncKey } from "./AppConfig";
import Cookies from "js-cookie";
import { ethers } from "ethers";
import store from "store";
import { SESSION_ACTIONS } from "reducers/SessionReducers";

export const clearData = (callback = () => {}) => {
  Cookies.remove(AsyncKey.accessTokenKey);
  Cookies.remove(AsyncKey.refreshTokenExpire);
  Cookies.remove(AsyncKey.refreshTokenKey);
  Cookies.remove(AsyncKey.tokenExpire);
  callback();
};

export const setCookie = (key: string, val: any) => {
  return new Promise<void>((resolve, reject) => {
    window.parent.postMessage(
      { type: "buidler-plugin-set-cookie", key, value: val },
      { targetOrigin: "*" }
    );
    store.dispatch(SESSION_ACTIONS.updateSession({ key, value: val }));
    Cookies.set(key, val);
    return resolve();
  });
};

export const getCookie = async (key: string) => {
  return new Promise<any>((resolve) => {
    const data = Cookies.get(key);
    return resolve(data || store.getState().session?.[key]);
  });
};

export const removeCookie = (key: string) => {
  Cookies.remove(key);
};

export const getDeviceCode = async () => {
  const current = await getCookie(AsyncKey.deviceCode);
  if (typeof current === "string") {
    return current;
  }
  const uuid = getUniqueId();
  setCookie(AsyncKey.deviceCode, uuid);
  return uuid;
};

export const GeneratedPrivateKey = async () => {
  const current = await getCookie(AsyncKey.generatedPrivateKey);
  if (typeof current === "string") {
    return current;
  }
  const { privateKey } = ethers.Wallet.createRandom();
  setCookie(AsyncKey.generatedPrivateKey, privateKey);
  return privateKey;
};
