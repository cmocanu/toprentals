import { postRequest, getRouteURL, getRequest, deleteRequest, putRequest } from "./util";
import { User } from "./Types";

export async function login(email: string, password: string): Promise<User | Error> {
  const res = await postRequest(getRouteURL("/login"), JSON.stringify({ email, password }));
  if (res instanceof Error) {
    return res;
  }

  const token = res.authToken;
  const userInfo: User = JSON.parse(atob(token.split(".")[1]));
  localStorage.setItem("userToken", token);
  localStorage.setItem("userId", userInfo.id.toString());
  localStorage.setItem("userName", userInfo.name);
  localStorage.setItem("userEmail", userInfo.email);
  localStorage.setItem("userType", userInfo.type);
  return userInfo;
}

export async function logout(): Promise<true | Error> {
  const res = await postRequest(getRouteURL("/logout"), null);
  if (!(res instanceof Error)) {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userType");
  }
  // TODO redirect to homepage
  return res;
}

export async function signUp(user: Partial<User>): Promise<true | Error> {
  return await postRequest(getRouteURL("/register"), JSON.stringify(user));
}

export async function getRealtors(): Promise<User[] | Error> {
  return await getRequest(getRouteURL("/users?type=REALTOR"));
}

export async function getUsers(pageNr: number): Promise<{ pageCount: number; users: User[] } | Error> {
  return await getRequest(getRouteURL(`/users?page=${pageNr}`));
}

export async function editUser(user: Partial<User>): Promise<true | Error> {
  if (user.id === undefined) {
    return Error("User must have an id to be editable.");
  }
  if (user.password?.length === 0) {
    user.password = undefined;
  }
  const route = `/users/${user.id}`;
  return await putRequest(getRouteURL(route), JSON.stringify(user));
}

export async function removeUser(user: User): Promise<true | Error> {
  const route = `/users/${user.id}`;
  return await deleteRequest(getRouteURL(route));
}
