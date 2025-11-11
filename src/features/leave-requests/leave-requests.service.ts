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

export const approveLeaveRequest = (
  org_uuid: string,
  leaveRequestUuid: string,
  managerUuid: string,
  remark?: string
) => {
  return axiosInterceptorInstance.patch(
    `/organizations/leave-requests/${leaveRequestUuid}/approve`,
    {
      manager_uuid: managerUuid,
      remark,
    },
    {
      headers: {
        org_uuid,
      },
    }
  );
};

export const recommendLeaveRequest = (
  org_uuid: string,
  leaveRequestUuid: string,
  managerUuid: string,
  remark?: string
) => {
  return axiosInterceptorInstance.patch(
    `/organizations/leave-requests/${leaveRequestUuid}/recommend`,
    {
      manager_uuid: managerUuid,
      remark,
    },
    {
      headers: {
        org_uuid,
      },
    }
  );
};

export const rejectLeaveRequest = (
  org_uuid: string,
  leaveRequestUuid: string,
  managerUuid: string,
  remark?: string
) => {
  return axiosInterceptorInstance.patch(
    `/organizations/leave-requests/${leaveRequestUuid}/reject`,
    {
      manager_uuid: managerUuid,
      remark,
    },
    {
      headers: {
        org_uuid,
      },
    }
  );
};


