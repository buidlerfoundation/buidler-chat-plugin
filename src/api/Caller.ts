import { BaseDataApi } from "models";
import AppConfig, {
  AsyncKey,
  whiteListRefreshTokenApis,
} from "common/AppConfig";
import { clearData, getCookie, setCookie } from "common/Cookie";
import FormData from "form-data";
import api from "api";
import { toast } from "react-hot-toast";

const METHOD_GET = "get";
const METHOD_POST = "post";
const METHOD_PUT = "put";
const METHOD_DELETE = "delete";
const METHOD_PATCH = "patch";

const sleep = (timeout = 1000) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

const handleError = (
  message: string,
  apiData: any,
  withoutToastError?: boolean
) => {
  const { uri, fetchOptions } = apiData;
  if (!withoutToastError) {
    toast.error(message)
  }
};

const getRequestBody = (data: any) => {
  try {
    const body = JSON.parse(data);
    return body;
  } catch (error) {
    return {};
  }
};

function fetchWithRetry<T = any>(
  uri: string,
  fetchOptions: any = {},
  retries = 0,
  serviceBaseUrl?: string,
  withoutToastError?: boolean
): Promise<BaseDataApi<T>> {
  let apiUrl = "";
  if (serviceBaseUrl) {
    apiUrl = serviceBaseUrl + uri;
  } else {
    apiUrl = AppConfig.apiBaseUrl + uri;
  }
  return fetch(apiUrl, fetchOptions)
    .then((res) => {
      return res
        .json()
        .then(async (data) => {
          if (res.status !== 200) {
            handleError(
              data?.message,
              { uri, fetchOptions },
              withoutToastError
            );
            return { ...data, statusCode: res.status };
          }
          if (data.data) {
            return { ...data, statusCode: res.status };
          }
          if (data.success || data.message) {
            return {
              data: data.data,
              success: data.success,
              message: data.message,
              statusCode: res.status,
            };
          }
          return { data, statusCode: res.status };
        })
        .catch((err) => {
          return { message: err, statusCode: res.status };
        });
    })
    .catch(async (err) => {
      const msg = err.message || err || "";
      if (msg === "Failed to fetch") {
        if (retries > 0) {
          await sleep();
          return fetchWithRetry<T>(
            uri,
            fetchOptions,
            retries - 1,
            serviceBaseUrl,
            withoutToastError
          );
        }
      }
      if (!msg.includes("aborted")) {
        handleError(msg, { uri, fetchOptions }, withoutToastError);
      }
      return {
        message: msg,
      };
    });
}

function isWhiteList(method: string, uri: string) {
  return (
    whiteListRefreshTokenApis.includes(`${method}-${uri}`) ||
    /get-profiles\/.*\/extensions/.test(`${method}-${uri}`) ||
    /get-user\/.*\/team/.test(`${method}-${uri}`) ||
    /get-team\/.*/.test(`${method}-${uri}`) ||
    /get-extensions\/social\/.*/.test(`${method}-${uri}`) ||
    /authentication\/ott\/.*/.test(`${method}-${uri}`) ||
    /get-user\/nft\?.*/.test(`${method}-${uri}`) ||
    /post-team\/invitation\/.*\/members/.test(`${method}-${uri}`)
  );
}

async function requestAPI<T = any>(
  method: string,
  uri: string,
  body?: any,
  serviceBaseUrl?: string,
  controller?: AbortController,
  h?: any,
  withoutToastError?: boolean
): Promise<BaseDataApi<T>> {
  if (!isWhiteList(method, uri) && !h) {
    const expireTokenTime = await getCookie(AsyncKey.tokenExpire);
    const refreshToken = await getCookie(AsyncKey.refreshTokenKey);
    if (!expireTokenTime || new Date().getTime() / 1000 > expireTokenTime) {
      // store dispatch refresh token
      const refreshRes = await api.user.refreshToken(refreshToken);
      if (refreshRes.statusCode !== 200) {
        clearData();
        window.location.reload();
        return {
          success: false,
          statusCode: 403,
        };
      } else {
        await setCookie(AsyncKey.accessTokenKey, refreshRes.data?.token);
        await setCookie(AsyncKey.tokenExpire, refreshRes.data?.token_expire_at);
        await setCookie(
          AsyncKey.refreshTokenKey,
          refreshRes.data?.refresh_token
        );
        await setCookie(
          AsyncKey.refreshTokenExpire,
          refreshRes.data?.refresh_token_expire_at
        );
      }
    }
  }
  // Build API header
  let headers: any = {
    Accept: "*/*",
    "Access-Control-Allow-Origin": "*",
    "Chain-Id": process.env.NEXT_PUBLIC_CHAIN_ID,
  };
  if (body instanceof FormData) {
    // headers['Content-Type'] = 'multipart/form-data';
    // headers = {};
  } else {
    headers["Content-Type"] = "application/json";
  }

  // Get access token and attach it to API request's header
  try {
    const accessToken = await getCookie(AsyncKey.accessTokenKey);
    if (accessToken != null) {
      headers.Authorization = `Bearer ${accessToken}`;
    } else {
      console.log("No token is stored");
    }
  } catch (e: any) {
    console.log(e);
  }

  if (h) {
    headers = {
      ...headers,
      ...h,
    };
  }

  // Build API body
  let contentBody: any = null;
  if (
    method.toLowerCase() === METHOD_POST ||
    method.toLowerCase() === METHOD_PUT ||
    method.toLowerCase() === METHOD_DELETE ||
    method.toLowerCase() === METHOD_PATCH
  ) {
    if (body) {
      if (body instanceof FormData) {
        contentBody = body;
      } else {
        contentBody = JSON.stringify(body);
      }
    }
  }
  // Construct fetch options
  const fetchOptions: RequestInit = { method, headers, body: contentBody };
  if (!!controller) {
    fetchOptions.signal = controller.signal;
  }
  // Run the fetching
  // if (!navigator.onLine) {
  //   return Promise.reject(Error("No internet connection"));
  // }

  return fetchWithRetry<T>(
    uri,
    fetchOptions,
    0,
    serviceBaseUrl,
    withoutToastError
  );
}

const timeRequestMap: { [key: string]: any } = {};

const Caller = {
  get<T>(
    url: string,
    baseUrl?: string,
    controller?: AbortController,
    withoutToastError?: boolean,
    headers?: any
  ) {
    return requestAPI<T>(
      METHOD_GET,
      url,
      undefined,
      baseUrl,
      controller,
      headers,
      withoutToastError
    );
  },

  post<T>(
    url: string,
    data?: any,
    baseUrl?: string,
    controller?: AbortController,
    h?: any
  ) {
    return requestAPI<T>(METHOD_POST, url, data, baseUrl, controller, h);
  },

  patch<T>(
    url: string,
    data?: any,
    baseUrl?: string,
    controller?: AbortController
  ) {
    return requestAPI<T>(METHOD_PATCH, url, data, baseUrl, controller);
  },

  put<T>(
    url: string,
    data?: any,
    baseUrl?: string,
    controller?: AbortController
  ) {
    return requestAPI<T>(METHOD_PUT, url, data, baseUrl, controller);
  },

  delete<T>(
    url: string,
    data?: any,
    baseUrl?: string,
    controller?: AbortController
  ) {
    return requestAPI<T>(METHOD_DELETE, url, data, baseUrl, controller);
  },

  getWithLatestResponse(url: string, baseUrl?: string): Promise<any> {
    const currentTime = new Date().getTime();
    if (!timeRequestMap[url]) {
      timeRequestMap[url] = {
        requestTime: currentTime,
      };
    } else {
      timeRequestMap[url].requestTime = currentTime;
    }
    return new Promise((resolve) => {
      return requestAPI(METHOD_GET, url, undefined, baseUrl).then(
        (res: any) => {
          const { requestTime } = timeRequestMap[url] || {};
          if (requestTime !== currentTime) {
            return resolve({ statusCode: 400, cancelled: true });
          }
          delete timeRequestMap[url];
          return resolve(res);
        }
      );
    });
  },

  postWithLatestResponse(
    url: string,
    data?: any,
    baseUrl?: string
  ): Promise<any> {
    const currentTime = new Date().getTime();
    if (!timeRequestMap[url]) {
      timeRequestMap[url] = {
        requestTime: currentTime,
      };
    } else {
      timeRequestMap[url].requestTime = currentTime;
    }
    return new Promise((resolve) => {
      return requestAPI(METHOD_POST, url, data, baseUrl).then((res: any) => {
        const { requestTime } = timeRequestMap[url] || {};
        if (requestTime !== currentTime) {
          return resolve({ statusCode: 400, cancelled: true });
        }
        delete timeRequestMap[url];
        return resolve(res);
      });
    });
  },
};

export default Caller;
