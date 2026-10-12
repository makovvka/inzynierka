import api from "./client";

export const loginUser = (data) => {
  return api.post("/api/auth/login", data);
};

export const registerUser = (data) => {
  return api.post("/api/auth/register", data);
};
