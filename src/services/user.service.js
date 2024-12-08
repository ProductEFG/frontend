import apiClient from "../apis/apiClient";
import UserEntity from "../entities/userEntity";

const login = async (username, password) => {
  try {
    const response = await apiClient.post("users/login", {
      username,
      password,
    });

    const user = response.data;

    return user;
  } catch (error) {
    throw new Error("Invalid Credentials");
  }
};

const register = async (registerData) => {
  try {
    console.log(registerData);
    const response = await apiClient.post("users/register", {
      ...registerData,
    });

    const user = response.data;

    return user;
  } catch (error) {
    console.log(error);
    throw new Error("Invalid Data, Failed to register");
  }
};

const isUsernameAvailable = async (username) => {
  try {
    await apiClient.get(`users/get-username/${username}`);

    return true;
  } catch (error) {
    return false;
  }
};

const fetchUser = async (username) => {
  try {
    const response = await apiClient.get(`users/get-username/${username}`);

    return response.data;
  } catch (error) {
    throw new Error("An unexpected error occurred");
  }
};

const fetchLeaderboards = async (limit) => {
  try {
    const response = await apiClient.get(`users/get-leaderboards/${limit}`);

    return response.data;
  } catch (error) {
    throw new Error("An unexpected error occurred");
  }
};

const getUsers = async (page, searchQuery) => {
  try {
    const response = await apiClient.get(
      `users/getall-users?page=${page}&searchQuery=${searchQuery}`
    );

    return response.data;
  } catch (error) {
    throw new Error("An unexpected error occurred");
  }
};

const updateBalance = async (balance, userId) => {
  try {
    const response = await apiClient.put(`users/update-balance`, {
      balance,
      userId,
    });

    return response.data;
  } catch (error) {
    throw new Error("An unexpected error occurred");
  }
};

export const userService = {
  login,
  register,
  isUsernameAvailable,
  fetchUser,
  fetchLeaderboards,
  getUsers,
  updateBalance,
};
