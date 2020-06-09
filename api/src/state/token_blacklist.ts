let blacklist: string[] = [];

export const addTokenToBlacklist = (token: string) => {
  blacklist.push(token);
};

export const isTokenInBlacklist = (token: string) => {
  return blacklist.indexOf(token) !== -1;
};
