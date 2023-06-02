import { AsyncKey } from "./AppConfig";
import Cookies from "js-cookie";

export const clearData = (callback = () => {}) => {
  Cookies.remove(AsyncKey.accessTokenKey);
  Cookies.remove(AsyncKey.refreshTokenExpire);
  Cookies.remove(AsyncKey.refreshTokenKey);
  Cookies.remove(AsyncKey.tokenExpire);
  callback();
};

export const setCookie = (key: string, val: any) => {
  return new Promise<void>((resolve, reject) => {
    Cookies.set(key, val);
    return resolve();
  });
};

export const getCookie = async (key: string) => {
  return new Promise<any>((resolve, reject) => {
    const data = Cookies.get(key);
    return resolve(data);
  });
};

export const removeCookie = (key: string) => {
  Cookies.remove(key);
};
