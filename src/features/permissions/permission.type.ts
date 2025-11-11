import { PaginationState } from "../user/user.slice";

export interface listPermissionPayload {
  org_uuid: string;
  pagination?: PaginationState;
}

export interface listRolePermission {
  org_uuid: string;
  role_uuid: string;
}
