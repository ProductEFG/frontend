import apiClient from "../apis/apiClient";

const getCompanies = async (balance) => {
  try {
    const response = await apiClient.get(`companies/get-companies/${balance}`);

    const companies = response.data;

    return companies;
  } catch (error) {
    throw new Error("An unexpected Error Occurred please contact the admins");
  }
};

const getMetrics = async () => {
  try {
    const metrics = await apiClient.get(`companies/metrics`);

    return metrics.data;
  } catch (error) {
    throw new Error("An unexpected Error Occurred please contact the admins");
  }
};

const updateCompany = async (formData) => {
  try {
    await apiClient.put("companies/update-company", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (error) {
    throw new Error("Error updating company");
  }
};

const addCompany = async (formData) => {
  try {
    await apiClient.post("companies/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (error) {
    throw new Error("Error adding company");
  }
};

const deleteCompany = async (companyId) => {
  try {
    await apiClient.delete(`companies/${companyId}`);
  } catch (error) {
    throw new Error("Error deleting company");
  }
};

const updateVisitors = async (visitors) => {
  try {
    await apiClient.put("companies/update-visitors", visitors);
  } catch (error) {
    throw new Error("Error updating visitors");
  }
};

export const companyService = {
  getCompanies,
  getMetrics,
  updateCompany,
  addCompany,
  deleteCompany,
  updateVisitors,
};
