import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { getLeaveRequests } from "./leave-requests.service";

export const getLeaveRequestsAction = createAsyncThunk(
  "orgnization/leave-requests",
  async (data: any, thunkAPI) => {
    try {
      const response = await getLeaveRequests(data, data.org_uuid);
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);
