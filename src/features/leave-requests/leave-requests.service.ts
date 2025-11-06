import axiosInterceptorInstance from "@/config/axios";

export const getLeaveRequests = (
  org_uuid: string,
  params?: { user_uuid?: string; page?: number; limit?: number; search?: string }
) => {
  return axiosInterceptorInstance.get(`/organizations/leave-requests`, {
    params,
    headers: {
      org_uuid,
    },
  });
};

export const getUserLeaveRequests = (
  org_uuid: string,
  user_uuid: string,
  params?: { page?: number; limit?: number; search?: string },
) => {
  return axiosInterceptorInstance.get(`/users/${user_uuid}/leave-requests`, {
    params,
    headers: {
      org_uuid,
    },
  });
};

export const createUserLeaveRequests = (
  org_uuid: string,
  user_uuid: string,
  data: any,
) => {
  return axiosInterceptorInstance.post(`/users/${user_uuid}/leave-requests`, data, {
    headers: {
      org_uuid,
    },
  });
};

