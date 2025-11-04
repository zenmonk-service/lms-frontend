import { createAsyncThunk } from "@reduxjs/toolkit";
import { getLeaveTypes } from "./leave-types.service";
import { AxiosError } from "axios";
import { createLeaveType, updateLeaveType } from "../organizations/organizations.service";

export const getLeaveTypesAction = createAsyncThunk(
  "organizations/getLeaveTypes",
  async (payload: { org_uuid: string; page?: number; limit?: number }, thunkAPI) => {
    try {
      const { org_uuid, page = 1, limit = 10 } = payload;
      const response = await getLeaveTypes(org_uuid, { page, limit });
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      return thunkAPI.rejectWithValue(error.response?.data ?? { message: error.message });
    }
  }
);

export const createLeaveTypeAction = createAsyncThunk(
  "orgnization/leave-type",
  async (data: any, thunkAPI) => {
    try {
      const response = await createLeaveType(data, data.org_uuid);
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const updateLeaveTypeAction = createAsyncThunk(
  "orgnization/leave-type",
  async (data: any, thunkAPI) => {
    try {
      const response = await updateLeaveType(data, data.org_uuid);
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);
