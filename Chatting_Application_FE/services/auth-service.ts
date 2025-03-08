import { API_URL } from "@/constants/endpoint";
import { ApiResponse, IProfile } from "@/types";
import { LoginCredentials } from "@/types/auth";
import { BE_URL } from "@/utils";
import { getCookie } from "cookies-next";
import apiClient from "./api-client";

export const authService = {
  login: async (data: LoginCredentials) => {
    await apiClient.post(`${API_URL.AUTH}/login`, data);
    const accessToken = getCookie("accessToken") || "";
    localStorage.setItem("accessToken", accessToken);
  },

  getCurrentProfile: async (): Promise<ApiResponse<IProfile>> => {
    return apiClient.get(`${API_URL.AUTH}/current-profile`);
  },

  refresh: async () => {
    await fetch(`${BE_URL}/${API_URL.AUTH}/refresh`);
  },

  logout: async () => {
    await fetch(`${BE_URL}/${API_URL.AUTH}/logout`);
    localStorage.removeItem("accessToken");
  },
};
