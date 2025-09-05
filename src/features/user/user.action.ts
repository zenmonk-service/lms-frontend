import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { signIn } from "./user.service";
import { userSignInType } from "./user.type";
import { SignInInterface } from "./user.slice";


export const signInAction = createAsyncThunk(
  userSignInType,
  async (signInInfo: SignInInterface ,thunkAPI) => {
    try {
      const response = await signIn();
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);
