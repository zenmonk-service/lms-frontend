import axiosInterceptorInstance from "@/config/axios";

export const getLeaveRequests = (
  org_uuid: string,
  params?: { page?: number; limit?: number; search?: string }
) => {
  return axiosInterceptorInstance.get(`/organizations/leave-requests`, {
    params,
    headers: {
      org_uuid,
    },
  });
};
