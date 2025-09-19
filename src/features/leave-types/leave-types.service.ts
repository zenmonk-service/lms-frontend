import axiosInterceptorInstance from "@/config/axios";

export const getLeaveTypes = (org_uuid: string, params?: { page?: number; per_page?: number }) => {
  return axiosInterceptorInstance.get(`/organizations/leave-types`, {
    params,
    headers: {
      org_uuid,
    },
  });
};
