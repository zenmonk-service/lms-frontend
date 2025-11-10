import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import {
  approveLeaveRequest,
  createUserLeaveRequests,
  getLeaveRequests,
  getUserLeaveRequests,
  recommendLeaveRequest,
  rejectLeaveRequest,
} from "./leave-requests.service";

export const getLeaveRequestsAction = createAsyncThunk(
  "orgnization/leave-requests",
  async (data: any, thunkAPI) => {
    try {
      const response = await getLeaveRequests(data.org_uuid, data);
      console.log("response: ", response.data);
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

export const approveLeaveRequestAction = createAsyncThunk(
  "leave-requests/approve",
  async (
    data: {
      org_uuid: string;
      leave_request_uuid: string;
      manager_uuid: string;
      remark?: string;
    },
    thunkAPI
  ) => {
    try {
      const response = await approveLeaveRequest(
        data.org_uuid,
        data.leave_request_uuid,
        data.manager_uuid,
        data.remark
      );
      // refresh list after successful operation
      try {
        if (data.org_uuid) {
          thunkAPI.dispatch(
            getLeaveRequestsAction({
              org_uuid: data.org_uuid,
              manager_uuid: data.manager_uuid,
              page: 1,
              limit: 10,
              search: "",
            } as any)
          );
        }
      } catch (e) {
        // ignore refresh errors
      }
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const recommendLeaveRequestAction = createAsyncThunk(
  "leave-requests/recommend",
  async (
    data: {org_uuid:string, leave_request_uuid: string; manager_uuid: string; remark?: string },
    thunkAPI
  ) => {
    try {
      const response = await recommendLeaveRequest(
        data.org_uuid,
        data.leave_request_uuid,
        data.manager_uuid,
        data.remark
      );
      try {
        const org_uuid = (thunkAPI.getState() as any).userSlice
          ?.currentOrganizationUuid;
        if (org_uuid) {
          thunkAPI.dispatch(
            getLeaveRequestsAction({
              org_uuid,
              manager_uuid: data.manager_uuid,
              page: 1,
              limit: 10,
              search: "",
            } as any)
          );
        }
      } catch (e) {}
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const rejectLeaveRequestAction = createAsyncThunk(
  "leave-requests/reject",
  async (
    data: { org_uuid: string,leave_request_uuid: string; manager_uuid: string; remark?: string },
    thunkAPI
  ) => {
    try {
      const response = await rejectLeaveRequest(
        data.org_uuid,
        data.leave_request_uuid,
        data.manager_uuid,
        data.remark
      );
      try {
        const org_uuid = (thunkAPI.getState() as any).userSlice
          ?.currentOrganizationUuid;
        if (org_uuid) {
          thunkAPI.dispatch(
            getLeaveRequestsAction({
              org_uuid,
              manager_uuid: data.manager_uuid,
              page: 1,
              limit: 10,
              search: "",
            } as any)
          );
        }
      } catch (e) {}
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);
