import { InitialApiData, UserData } from "models";
import Caller from "./Caller";

const UserAPI = {
  getInitial: () => Caller.get<InitialApiData>(`initial`),
  me: () => Caller.get<UserData>("user"),
  requestNonceWithAddress: (address: string) =>
    Caller.post<{ message: string }>("user/address", { address }),
  verifyNonce: (message: string, signature: string) =>
    Caller.post<{
      avatar_url: string;
      user_id: string;
      user_name: string;
    }>("user", { message, signature }),
  refreshToken: (token: string) =>
    Caller.post<{
      token: string;
      token_expire_at: number;
      refresh_token: string;
      refresh_token_expire_at: number;
    }>("user/refresh", undefined, undefined, undefined, {
      "Refresh-Token": token,
    }),
  generateTokenFromOTT: (ott: string) =>
    Caller.get<{
      token: string;
      token_expire_at: number;
      refresh_token: string;
      refresh_token_expire_at: number;
    }>(`authentication/ott/${ott}`),
  requestOTT: () => Caller.get<string>("authentication/ott"),
};

export default UserAPI;
