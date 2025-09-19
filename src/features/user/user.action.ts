import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { SignInInterface } from "./user.slice";
import { createUser, signIn } from "./user.service";
import { CreateUserPayload } from "./user.type";

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