
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { getOrganizationRoles } from "./role.service";


export const getOrganizationRolesAction = createAsyncThunk(
  "roles/get",
  async (org_uuid: string, thunkAPI ) => {
    try {
      const response = await getOrganizationRoles(org_uuid);
      return response.data;

    } catch (err) {
      const error = err as AxiosError;
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);
