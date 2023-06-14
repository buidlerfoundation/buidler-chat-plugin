import {
  createAction,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import api from "api";
import { Channel, Community, InitialApiData, UserData } from "models";

interface UserState {
  data: UserData;
  imgDomain?: string;
  imgBucket?: string;
  currentToken: string;
  community?: Community;
  channel?: Channel;
}

const initialState: UserState = {
  data: {
    avatar_url: "",
    user_id: "",
    user_name: "",
  },
  imgDomain: "",
  imgBucket: "",
  currentToken: "",
};

export const logoutAction = createAction("user/logout");

export const setUserCommunityData = createAsyncThunk(
  "user/community",
  async (payload: { communityId: string; channelId: string }) => {
    const { communityId, channelId } = payload;
    const [communityRes, channelRes] = await Promise.all([
      api.community.byId(communityId),
      api.channel.list(communityId),
    ]);
    const community = communityRes?.data;
    if (community) {
      community.total_members = communityRes.metadata?.total_members;
      community.total_online_members =
        communityRes.metadata?.total_online_members;
    }
    return {
      community,
      channel: channelRes?.data?.find((el) => el.channel_id === channelId),
    };
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    initial: (
      state: UserState,
      action: PayloadAction<InitialApiData | undefined>
    ) => {
      state.imgBucket = action.payload?.imgproxy.bucket_name;
      state.imgDomain = action.payload?.imgproxy.domain;
      state.networks = action.payload?.networks;
    },
    updateCurrentToken: (state: UserState, action: PayloadAction<string>) => {
      state.currentToken = action.payload;
    },
    updateCurrentUser: (
      state: UserState,
      action: PayloadAction<{ user?: UserData }>
    ) => {
      if (action.payload.user) {
        state.data = action.payload.user;
      }
    },
    updateCommunity: (
      state: UserState,
      action: PayloadAction<Community | undefined>
    ) => {
      state.community = action.payload;
    },
    updateCurrentChannel: (
      state: UserState,
      action: PayloadAction<Channel | undefined>
    ) => {
      state.channel = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logoutAction, (state: UserState) => {
        return {
          ...initialState,
          imgBucket: state.imgBucket,
          imgDomain: state.imgDomain,
        };
      })
      .addCase(setUserCommunityData.fulfilled, (state: UserState, action) => {
        state.community = action.payload.community;
        state.channel = action.payload.channel;
      });
  },
});

export const USER_ACTIONS = userSlice.actions;

export default userSlice.reducer;
