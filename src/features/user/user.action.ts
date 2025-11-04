import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { SignInInterface } from "./user.slice";
import { createUser, listUser, signIn } from "./user.service";
import { CreateUserPayload, listUserPayload } from "./user.type";

export const signInAction = createAsyncThunk(
  "auth/signIn",
  async (signInfo: SignInInterface, thunkAPI) => {
    try {
      const response = await signIn(signInfo);
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);



export const createUserAction = createAsyncThunk(
  "auth/create",
  async (payload : CreateUserPayload, thunkAPI) => {
    try {
      const response = await createUser(payload);
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);


export const listUserAction = createAsyncThunk(
  "auth/list",
  async (payload:listUserPayload, thunkAPI) => {
    try {
      const response = await listUser( payload.pagination , payload.org_uuid);
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);