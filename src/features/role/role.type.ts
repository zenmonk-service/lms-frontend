import { PaginationState } from "../user/user.slice";

export interface listRolePayload{
    org_uuid: string;
    pagination?: PaginationState
}