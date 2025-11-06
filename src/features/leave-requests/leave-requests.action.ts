import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import {
  createUserLeaveRequests,
  getLeaveRequests,
  getUserLeaveRequests,
} from "./leave-requests.service";

export const getLeaveRequestsAction = createAsyncThunk(
  "orgnization/leave-requests",
  async (data: any, thunkAPI) => {
    try {
      const response = await getLeaveRequests(data.org_uuid, data);
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const getUserLeaveRequestsAction = createAsyncThunk(
  "orgnization/user-leave-requests",
  async (data: any, thunkAPI) => {
    try {
      const response = await getUserLeaveRequests(
        data.org_uuid,
        data.user_uuid,
        data
      );
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const createUserLeaveRequestsAction = createAsyncThunk(
  "orgnization/create-user-leave-requests",
  async (data: any, thunkAPI) => {
    try {
      const response = await createUserLeaveRequests(
        data.org_uuid,
        data.user_uuid,
        data
      );
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);
