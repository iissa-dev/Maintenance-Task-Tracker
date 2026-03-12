let accessToken: string | null = null;

export const setToken = (token: string | null) => {
  accessToken = token;
};

export const getToken = () => accessToken;
