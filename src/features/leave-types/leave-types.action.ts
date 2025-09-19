import { createAsyncThunk } from "@reduxjs/toolkit";
import { getLeaveTypes } from "./leave-types.service";
import { AxiosError } from "axios";

export const getLeaveTypesAction = createAsyncThunk(
  "organizations/getLeaveTypes",
  async (payload: { org_uuid: string; page?: number; per_page?: number }, thunkAPI) => {
    try {
      const { org_uuid, page = 1, per_page = 10 } = payload;
      const response = await getLeaveTypes(org_uuid, { page, per_page });
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      return thunkAPI.rejectWithValue(error.response?.data ?? { message: error.message });
    }
  }
);