import apiClient from "../apis/apiClient";

const getCompanyHistory = async (companyId) => {
  try {
    const response = await apiClient.get(`stocksHistory/${companyId}`);

    const history = response.data;

    return history;
  } catch (error) {
    throw new Error("An unexpected Error Occurred please contact the admins");
  }
};

export const stocksHistoryService = {
  getCompanyHistory,
};
