import apiClient from "../apis/apiClient";

const getCompanyHistory = async (companyId, numberOfDays) => {
  try {
    const response = await apiClient.get(
      `stocksHistory/${companyId}?numberOfDays=${numberOfDays}`
    );

    const history = response.data;

    return history;
  } catch (error) {
    throw new Error("An unexpected Error Occurred please contact the admins");
  }
};

export const stocksHistoryService = {
  getCompanyHistory,
};
