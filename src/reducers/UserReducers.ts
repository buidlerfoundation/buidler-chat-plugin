import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
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
    builder.addCase(logoutAction, (state: UserState) => {
      return {
        ...initialState,
        imgBucket: state.imgBucket,
        imgDomain: state.imgDomain,
      };
    });
  },
});

export const USER_ACTIONS = userSlice.actions;

export default userSlice.reducer;
