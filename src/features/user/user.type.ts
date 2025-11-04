export const userSignInType = "user/signIn";

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: string;
  org_uuid: string;
}


export interface UpdateUserPayload {
  user_uuid: string;
  name?: string;
  email?: string;
  role?: string;
  org_uuid: string;
}



export interface listUserPayload {
  pagination: { page: number; limit: number ,search?: string };
  org_uuid: string;
}
