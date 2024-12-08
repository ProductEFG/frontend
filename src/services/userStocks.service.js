import apiClient from "../apis/apiClient";

const getUserStocksByCompany = async (userId, companyId) => {
  try {
    const response = await apiClient.get(
      `userStocks/get-one?userId=${userId}&companyId=${companyId}`
    );

    const userStocks = response.data;

    return userStocks;
  } catch (error) {
    if (error.status === 404) {
      return;
    }
    throw new Error("An unexpected Error Occurred please contact the admins");
  }
};

const getAllUserStocks = async (userId) => {
  try {
    const response = await apiClient.get(`userStocks/get-all/${userId}`);

    const userStocks = response.data;

    return userStocks;
  } catch (error) {
    if (error.status === 404) {
      return;
    }
    throw new Error("An unexpected Error Occurred please contact the admins");
  }
};

const buyStocks = async (userStocksData) => {
  try {
    const response = await apiClient.post(
      `userStocks/buy-stock`,
      userStocksData
    );

    const updatedUser = response.data;
    return updatedUser;
  } catch (error) {
    throw new Error("An unexpected Error Occurred please contact the admins");
  }
};

const sellStocks = async (userStocksData) => {
  try {
    const response = await apiClient.post(
      `userStocks/sell-stock`,
      userStocksData
    );

    const updatedUser = response.data;
    return updatedUser;
  } catch (error) {
    throw new Error("An unexpected Error Occurred please contact the admins");
  }
};

export const userStocksService = {
  getUserStocksByCompany,
  getAllUserStocks,
  buyStocks,
  sellStocks,
};
