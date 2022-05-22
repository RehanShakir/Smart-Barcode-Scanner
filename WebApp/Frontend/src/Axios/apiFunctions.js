import server from "./index";

import { getToken } from "../Redux/localstorage";

// const headerToken = {
//   headers: {
//     Authorization: `Bearer ${getToken()}`,
//   },
// };
export const getAllUsersData = () =>
  server.get("/admin/all-users", {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

export const getCounts = () =>
  server.get("/admin/count", {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

export const statusUpdate = (data) =>
  server.patch(
    `/admin/update-status/${data.id}`,
    { status: data.value },
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

export const getScannedData = () =>
  server.get("/admin/scanned-data", {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

export const getScannedDataLoggedInUser = () =>
  server.get("/barcode/data", {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

export const getScannedCountLoggedInUser = () =>
  server.get("/barcode/count", {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

export const updateProfile = (data) =>
  server.patch("/auth/update-profile", data, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

export const assignButtons = (data, id) =>
  server.patch(
    `/admin/update-buttons/${id}`,
    { assignedButtons: data },
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

export const userScannedData = async (data) => {
  const d = await server.get(`/admin/user-scanned-data/${data.id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return d;
};

export const claimInsurance = async (data, id) => {
  const res = await server.post(`/barcode/claim/${id}`, data, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res;
};
