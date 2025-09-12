import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import {
  getOrganizations,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  getOrganizationUsers,
  createOrganizationUser,
  updateOrganizationUser,
  deleteOrganizationUser,
} from "./organizations.service";

// ========== ORGANIZATION ACTIONS ==========

// Get all organizations
export const getOrganizationsAction = createAsyncThunk(
  "organizations/getAll",
  async (_ : string, thunkAPI) => {
    try {
      const response = await getOrganizations("");
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

// Get organization by id
export const getOrganizationsActionById = createAsyncThunk(
  "organizations/getAll",
  async (organization_id : string, thunkAPI) => {
    try {
      const response = await getOrganizations("");
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);


// Create organization
export const createOrganizationAction = createAsyncThunk(
  "organizations/create",
  async (organizationInfo: any, thunkAPI) => {
    try {
      const response = await createOrganization(organizationInfo);
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

// Update organization
export const updateOrganizationAction = createAsyncThunk(
  "organizations/update",
  async (
    {
      organizationId,
      organizationInfo,
    }: { organizationId: string; organizationInfo: any },
    thunkAPI
  ) => {
    try {
      const response = await updateOrganization(organizationId, organizationInfo);
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

// Delete organization
export const deleteOrganizationAction = createAsyncThunk(
  "organizations/delete",
  async (organizationId: string, thunkAPI) => {
    try {
      const response = await deleteOrganization(organizationId);
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

// ========== USER ACTIONS ==========

// Get users in organization
export const getUsersAction = createAsyncThunk(
  "users/getAll",
  async (organizationId: string, thunkAPI) => {
    try {
      const response = await getOrganizationUsers(organizationId, {});
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

// Create user
export const createUserAction = createAsyncThunk(
  "users/create",
  async (
    { organizationId, userInfo }: { organizationId: string; userInfo: any },
    thunkAPI
  ) => {
    try {
      const response = await createOrganizationUser(organizationId, userInfo);
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

// Update user
export const updateUserAction = createAsyncThunk(
  "users/update",
  async (
    { organizationId, userInfo }: { organizationId: string; userInfo: any },
    thunkAPI
  ) => {
    try {
      const response = await updateOrganizationUser(organizationId, userInfo);
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

// Delete user
export const deleteUserAction = createAsyncThunk(
  "users/delete",
  async (
    { organizationId, userInfo }: { organizationId: string; userInfo: any },
    thunkAPI
  ) => {
    try {
      const response = await deleteOrganizationUser(organizationId, userInfo);
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);
