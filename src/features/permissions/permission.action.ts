import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { listPermissionPayload, listRolePermission } from "./permission.type";
import {
  listOrganizationPermissions,
  listRolePermissions,
} from "./permission.service";
import { toast } from "sonner";

export const listOrganizationPermissionsAction = createAsyncThunk(
  "permissions/list",
  async (payload: listPermissionPayload, thunkAPI) => {
    try {
      const response = await listOrganizationPermissions(payload);
      return response.data;
    } catch (err) {
      toast.error("Something went wrong.");
      const error = err as AxiosError;
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const listRolePermissionsAction = createAsyncThunk(
  "/role-permissions/list",
  async (payload: listRolePermission, thunkAPI) => {
    try {
      const response = await listRolePermissions(payload);
      return response.data;
    } catch (err) {
      toast.error("Something went wrong.");
      const error = err as AxiosError;
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);
