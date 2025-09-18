import axiosInterceptorInstance from "@/config/axios";
import { OrganizationFetchPayload } from "./organizations.type";
import { Search } from "lucide-react";

export const getOrganizations = (payload: OrganizationFetchPayload) => {
  return axiosInterceptorInstance.get(`/users/${payload.uuid}`, {
    params: { page: payload.page , limit: payload.limit ,search : payload.search },
  });
};

export const getOrganizationsById = (payload: {organizationId :string  , email :  string}) => {
  return axiosInterceptorInstance.post(`/organizations` , payload);
};

export const createOrganization = (organizationInfo: any) => {
  return axiosInterceptorInstance.post(`/organizations`, organizationInfo);
};

export const updateOrganization = (
  organizationId: string,
  organizationInfo: any
) => {
  return axiosInterceptorInstance.put(
    `/organizations${organizationId}`,
    organizationInfo
  );
};

export const deleteOrganization = (organizationId: string) => {
  return axiosInterceptorInstance.delete(`/organizations/${organizationId}`);
};

export const getOrganizationUsers = (organizationId: string, userInfo: any) => {
  return axiosInterceptorInstance.get(
    `/organizations/${organizationId}/users`,
    userInfo
  );
};

export const createOrganizationUser = (
  organizationId: string,
  userInfo: any
) => {
  return axiosInterceptorInstance.post(
    `/organizations/${organizationId}/users`,
    userInfo
  );
};

export const updateOrganizationUser = (
  organizationId: string,
  userInfo: any
) => {
  return axiosInterceptorInstance.post(
    `/organizations/${organizationId}/users`,
    userInfo
  );
};

export const deleteOrganizationUser = (
  organizationId: string,
  userInfo: any
) => {
  return axiosInterceptorInstance.post(
    `/organizations/${organizationId}/users`,
    userInfo
  );
};

export const getOrganizationRoles = (org_uuid: string) => {
  return axiosInterceptorInstance.get(`/organizations/roles` ,  {
    // headers: {
    //   org_uuid: org_uuid,
    // }
   })
};