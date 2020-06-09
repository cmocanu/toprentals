const createRequest = (method: "GET" | "POST" | "PUT" | "DELETE") => async (
  route: string,
  body: any
): Promise<any | Error> => {
  const token = localStorage.getItem("userToken");
  try {
    const rawResponse = await fetch(route, {
      method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body,
    });
    if (rawResponse.status !== 200) {
      const content = await rawResponse.json();
      return new Error(content.error.message);
    } else {
      return await rawResponse.json();
    }
  } catch {
    // Fetch only throws on network request failed, so we will show a generic error
    return new Error("Something went wrong. Please try again.");
  }
};

const helperGetRequest = createRequest("GET");
export const getRequest = (route: string) => {
  return helperGetRequest(route, null);
};
export const postRequest = createRequest("POST");
const helperDeleteRequest = createRequest("DELETE");
export const deleteRequest = (route: string) => {
  return helperDeleteRequest(route, JSON.stringify({}));
};
export const putRequest = createRequest("PUT");

export const getRouteURL = (route: string) => {
  return "http://localhost:8000" + route;
};
