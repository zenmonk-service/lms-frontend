import axiosInterceptorInstance from "@/config/axios";
import { listRolePayload } from "./role.type";

export const getOrganizationRoles = (payload: listRolePayload) => {
  return axiosInterceptorInstance.get(`/organizations/roles`, {
    headers: {
      org_uuid: payload.org_uuid,
    },
    params: {
      page: payload?.pagination?.page,
      limit: payload?.pagination?.limit,
      search: payload?.pagination?.search,
    },
  });
};
