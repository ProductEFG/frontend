import apiClient from "../apis/apiClient";

const fetchUserProfit = async (userId) => {
  try {
    const response = await apiClient.get(`userProfit/${userId}`);

    return response.data;
  } catch (error) {
    throw new Error("An unexpected error occurred");
  }
};

export const userProfitService = {
  fetchUserProfit,
};
