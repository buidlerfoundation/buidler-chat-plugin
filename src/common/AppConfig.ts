import { Community, UserData } from "models";

const Prefix = "Buidler-Chat-Plugin";

const AppConfig = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  maximumFileSize: 100000000,
};

export default AppConfig;

export const AsyncKey = {
  accessTokenKey: `${Prefix}_access_token`,
  refreshTokenKey: `${Prefix}_refresh_token`,
  tokenExpire: `${Prefix}_token_expire_key`,
  refreshTokenExpire: `${Prefix}_refresh_token_expire_key`,
  loginType: `${Prefix}_login_key`,
  deviceId:`${Prefix}_device_id`,
  deviceCode: `${Prefix}_device_code`,
  generatedPrivateKey: `${Prefix}_generated_private_key`,
};

export const whiteListRefreshTokenApis = [
  "get-initial",
  "post-user/refresh",
  "post-user/address",
  "post-user",
  "delete-user/device",
  "get-systems/config",
  "get-user/nft-collection",
];

export const DeletedUser: UserData = {
  user_id: "",
  user_name: "Deleted User",
  avatar_url: "",
};

export const DirectCommunity: Community = {
  team_id: "b796712f-eea4-4ba1-abc6-ca76e9af24bc",
  team_display_name: "Direct Message",
  direct: true,
};

export const LoginType = {
  WalletConnect: "WalletConnect",
  WalletImport: "WalletImport",
  MetaMask: "MetaMask",
  Web3Auth: "Web3Auth",
  OTT: "OTT",
};
