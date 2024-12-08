import apiClient from "../apis/apiClient";

const login = async (email, password) => {
  try {
    const response = await apiClient.post(`admin/login`, { email, password });

    const admin = response.data;

    return admin;
  } catch (error) {
    throw new Error("Invalid Credentials");
  }
};

const getTransactions = async (type, page, order) => {
  try {
    const response = await apiClient.get(
      `transactions?type=${type}&page=${page}&order=${order}`
    );

    const transactionData = response.data;

    return transactionData;
  } catch (error) {
    throw new Error("Failed to retrieve transactions");
  }
};

export const adminService = {
  login,
  getTransactions,
};
