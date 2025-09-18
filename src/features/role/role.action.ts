
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { SignInInterface } from "./role.slice";
import { signIn } from "./role.service";


export const signInAction = createAsyncThunk(
  "auth/signIn",
  async (signInfo: SignInInterface, thunkAPI ) => {
    try {
      const response = await signIn(signInfo);
      console.log("Ffffccc")
      return response.data;

    } catch (err) {
      console.log("Ffff")
      const error = err as AxiosError;
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);
