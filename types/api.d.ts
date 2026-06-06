import type { Asset } from "./user";

export interface LoginResponse {
  message?: string;
  data: {
    accessToken: string;
    user: {
      id: string;
      userName: string;
      email: string;
      roles?: string[];
      scopes?: string[];
    };
  };
}

export interface UserResponse {
  data: {
    id: string;
    userName: string;
    email: string;
    roles?: string[];
    scopes?: string[];
  };
}


export type AssetsResponse = {
  message: string;
  code: string;
  data: Asset[];
};

export type AssetSingleResponse = {
  message: string;
  code: string;
  data: Asset;
};
