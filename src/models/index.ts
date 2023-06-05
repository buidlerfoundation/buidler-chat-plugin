import { ethers } from "ethers";

export interface Contract {
  contract_address: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  owner: string;
  is_potential: boolean;
  logo_url: string;
}

export interface Token {
  contract: Contract;
  balance: number;
  price?: TokenPrice;
}

export interface TokenPrice {
  rate: number;
  diff?: number;
  diff1h?: number;
  diff7d?: number;
  diff30d?: number;
  diff60d?: number;
  diff90d?: number;
  marketCapUsd?: number;
  volume24h?: number;
  availableSupply?: number;
  ts?: string;
  currency?: string;
}

export interface NFTCollection {
  name: string;
  description: string;
  contract_address: string;
  token_type: string;
  image_url: string;
  background_image_url: string;
  external_url: string;
  symbol: string;
  network: string;
  slug: string;
}

export interface UserData {
  avatar_url: string;
  encrypt_message_key?: string;
  is_verified_avatar?: boolean;
  is_verified_username?: boolean;
  nonce?: string;
  user_id: string;
  user_name: string;
  role?: string;
  status?: string;
  direct_channel?: string;
  user_channels?: Array<string>;
  bio?: string;
  background_url?: string;
  address?: string;
  verified_username_asset_collection?: UserNFTCollection;
  verified_avatar_asset?: NFTDetailDataApi;
  is_deleted?: boolean;
  total_unread_notifications?: number;
}

export interface Community {
  team_display_name: string;
  team_icon?: string;
  team_id: string;
  team_url?: string;
  role?: string;
  team_description?: string;
  seen?: boolean;
  is_verified?: boolean;
  direct?: boolean;
  team_background?: string;
  verified_team_namespace_asset_collection?: UserNFTCollection;
  total_members?: number;
  total_online_members?: number;
  ens?: string;
}

export interface BaseDataApi<T> {
  success: boolean;
  data?: T;
  statusCode: number;
  message?: string;
  total?: number;
  token?: string;
  metadata?: {
    total?: number;
    encrypt_message_key?: string;
    can_loadmore_message_after?: boolean;
    can_loadmore_message_before?: boolean;
    total_members?: number;
    total_online_members?: number;
  };
  refresh_token?: string;
  token_expire_at?: number;
  refresh_token_expire_at?: number;
}

export interface ProfileExtensionRelation {
  profile_extension_relation_id: string;
  is_active?: boolean;
  extension_id: string;
  order?: number;
  profile_type: string;
  profile_id: string;
  createdAt?: string;
  updatedAt?: string;
  extension: ExtensionDataApi;
}

export interface ProfileApiData {
  profile: {
    user_id?: string;
    team_id?: string;
  };
  profile_extension_relations: ProfileExtensionRelation[];
}

interface ImageConfig {
  avatar: string;
  logo: string;
  message: string;
  task: string;
}

interface Network {
  chain_id: number;
  logo: string;
  marketplaces: {
    [key: string]: {
      nft_base_url: string;
      nft_collection_base_url: string;
    };
  };
  symbol: string;
}

export interface InitialNetwork {
  [key: string]: {
    mainnet: Network;
    testnet: Network;
  };
}

export interface InitialApiData {
  force_update: boolean;
  img_domain: string;
  version: string;
  img_config: ImageConfig;
  imgproxy: {
    bucket_name: string;
    domain: string;
  };
  networks?: InitialNetwork;
}

export interface NFTCollectionDataApi {
  name: string;
  description?: string;
  contract_address: string;
  token_type: string;
  image_url: string;
  background_image_url: string;
  external_url: string;
  symbol: string;
  network: string;
  nfts: Array<UserNFTCollection>;
  slug: string;
  marketplaces: {
    [key: string]: {
      marketplace: string;
      last_ingested_at: string;
      name: string;
      safelist_request_status: string;
      slug?: string;
      floor_price?: number;
      external_url?: string;
    };
  };
}

export interface ENSAsset {
  token_id: string;
  value: string;
  can_set_username: boolean;
  can_set_team_namespace: boolean;
  contract_address: string;
  network: string;
}

export interface UserNFTCollection {
  _id: string;
  name: string;
  description: string;
  contract_address: string;
  token_type: string;
  image_url: string;
  background_image_url: string;
  external_url: string;
  symbol: string;
  network: string;
  token_id: string;
  nft_collection?: NFTCollection;
  can_set_username?: boolean;
  can_set_avatar?: boolean;
  media: {
    bytes: number;
    format: string;
    gateway: string;
    raw: string;
    thumbnail: string;
  }[];
}

export interface FileApiData {
  file_url: string;
  file: {
    attachment_id: string;
    createdAt: string;
    file_id: string;
    mimetype: string;
    original_name: string;
    team_id: string;
    updatedAt: string;
  };
}

export interface SocialItem {
  social_extension_item_id: string;
  order?: number;
  is_visible?: boolean;
  social_extension_id?: string;
  social_extension_item_name?: string;
  social_extension_item_code_name?: string;
  createdAt?: string;
  updatedAt?: string;
  value?: string;
  is_pinned?: boolean;
}

export interface SocialExtension {
  social_extension_id: string;
  social_extension_name: string;
  profile_id: string;
  is_active: boolean;
  is_visible: boolean;
  createdAt: string;
  updatedAt: string;
  social_extension_items: SocialItem[];
  profile_extension_relation_id: string;
  order: number;
}

export interface ExtensionDataApi {
  extension_id: string;
  extension_name: string;
  extension_code_name: string;
  extension_type: string;
  is_active?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SendData = {
  recipientAddress?: string;
  asset?: Token | null;
  nft?: UserNFTCollection | null;
  amount?: number | string;
  amountUSD?: number | string;
  gasPrice?: ethers.BigNumber;
  gasLimit: ethers.BigNumber;
  recipientENS?: string | null;
  recipientUser?: UserData | null;
};

export type NFTDetailDataApi = {
  _id: string;
  contract_address: string;
  token_id: string;
  user_id: string;
  name: string;
  token_type: string;
  display_name: string;
  image_url: string;
  background_image_url: string;
  network: string;
  attributes: {
    _id: string;
    contract_address: string;
    token_id: string;
    trait_type: string;
    value: string;
    network: string;
  }[];
  collection: NFTCollectionDataApi;
  media: {
    bytes: number;
    format: string;
    gateway: string;
    raw: string;
    thumbnail: string;
  }[];
};

export type PreviewPlatform = "mobile" | "desktop";

export type ClaimTransaction = {
  created_at: string;
  id: string;
  ip: string;
  network: string;
  token_type: string;
  tx_hash: string;
  unique_device_id: string;
  updated_at: string;
  user_id: string;
};

export type LocalAttachment = {
  file?: any;
  loading?: boolean;
  type?: string;
  fileName?: string;
  id?: string;
  randomId?: string;
  url?: string;
  attachmentId?: string;
};

export interface Space {
  is_hidden?: boolean;
  order: number;
  space_emoji?: string;
  space_id: string;
  space_image_url?: string;
  space_name: string;
  space_type: "Public" | "Private";
  team_id?: string;
  space_description?: string;
  icon_color?: string;
  icon_sub_color?: string;
  attachment?: LocalAttachment;
  space_background_color?: string;
  channel_ids: Array<string>;
  is_space_member: boolean;
}

export interface Channel {
  channel_emoji?: string;
  channel_id: string;
  channel_image_url?: string;
  channel_members: Array<string>;
  channel_name: string;
  channel_type: "Public" | "Private" | "Direct";
  notification_type?: string;
  seen?: boolean;
  space?: Space;
  space_id?: string;
  user?: UserData;
  group_channel_id?: string;
  attachment?: any;
  is_chat_deactivated?: boolean;
  updatedAt?: string;
  team_id?: string;
  dapp_integration_url?: string;
  is_dapp_extension_required?: boolean;
  firstItem?: boolean;
}

export interface AttachmentData {
  file_id: string;
  file_url?: string;
  mimetype?: string;
  original_name?: string;
  is_uploaded?: boolean;
  localFile?: LocalAttachment;
}

export interface TagData {
  mention_id: string;
  tag_type: string;
}

export interface ReactionData {
  attachment_id: string;
  emoji_id: string;
  reaction_count: string;
  skin: number;
}

export interface UserReaction {
  attachment_id: string;
  emoji_id: string;
}

export interface TaskData {
  channels?: Array<Channel>;
  comment_count: number;
  creator: UserData;
  creator_id: string;
  reaction_data: ReactionData[];
  status: "pinned" | "todo" | "doing" | "done" | "archived";
  task_attachments?: AttachmentData[];
  task_id: string;
  task_tags: TagData[];
  content: string;
  up_votes: number;
  user_reaction: UserReaction[];
  assignee?: UserData;
  due_date?: Date | string;
  isHighLight?: boolean;
  createdAt?: string;
  updatedAt?: string;
  total_messages?: string;
  latest_reply_message_at?: string;
  latest_reply_senders?: Array<string>;
  total_reply_sender?: string;
  root_message_channel_id: string;
  message_created_at: string;
  message_sender_id: string;
  cid?: string;
  uploadingIPFS?: boolean;
  notification_type?: "alert" | "muted";
  total_unread_notifications?: number;
}

export interface ConversationData {
  content: string;
  createdAt: string;
  message_attachments: AttachmentData[];
  message_id: string;
  message_tag: TagData[];
  reply_message_id: string;
  plain_text: string;
  sender_id: string;
  updatedAt: string;
  task?: TaskData;
  isHead: boolean;
  isSending?: boolean;
  isConversationHead?: boolean;
  reaction_data: Array<ReactionData>;
  user_reaction: Array<UserReaction>;
  entity_id: string;
  entity_type: string;
  metadata?: {
    type: "scam_alert" | "asset";
    data: {
      content: string;
      content_type: string;
      created_at: string;
      id: string;
      updated_at: string;
    };
  };
  is_scam_detected?: boolean;
  files?: any[];
}

export interface MessageDateData {
  type: "date";
  value: string;
}

export interface MessageData extends ConversationData {
  conversation_data?: ConversationData;
}

export type EmitMessageData = {
  entity_id: string;
  content: string;
  plain_text: string;
  mentions?: any[];
  message_id?: string;
  member_data?: { key: string; timestamp: number; user_id: string }[];
  reply_message_id?: string;
  text?: string;
  entity_type?: string;
  file_ids?: string[];
  files?: LocalAttachment[];
}
