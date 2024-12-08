import apiClient from "../apis/apiClient";

const getOneUserWithdraws = async (id) => {
  try {
    const response = await apiClient.get(`userWithdraw/get-one/${id}`);

    const userWithdraws = response.data;

    return userWithdraws;
  } catch (error) {
    if (error.status === 404) {
      return;
    }
    throw new Error("An unexpected Error Occurred please contact the admins");
  }
};

const getAllUserWithdraws = async (page, order) => {
  try {
    const response = await apiClient.get(
      `userWithdraw/get-all?page=${page}&order=${order}`
    );

    const userWithdraws = response.data;

    return userWithdraws;
  } catch (error) {
    if (error.status === 404) {
      return;
    }
    throw new Error("An unexpected Error Occurred please contact the admins");
  }
};

const withdrawFunds = async (userId, withdraw_amount) => {
  try {
    const response = await apiClient.post(`userWithdraw/withdraw-funds`, {
      userId,
      withdraw_amount,
    });

    const updatedUser = response.data;

    return updatedUser;
  } catch (error) {
    if (error.status === 404) {
      return;
    }
    throw new Error("An unexpected Error Occurred please contact the admins");
  }
};

export const userWithdrawService = {
  getOneUserWithdraws,
  getAllUserWithdraws,
  withdrawFunds,
};
