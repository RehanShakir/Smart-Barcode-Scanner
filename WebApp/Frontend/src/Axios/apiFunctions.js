import server from "./index";

import { getToken } from "../Redux/localstorage";

export const getAllUsersData = () =>
  server.get("/admin/all-users", {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

export const getOneUser = async (id) =>
  await server.get(`/admin/user/${id.id}`, {
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

export const uploadPhotos = async (photos, id) => {
  const res = await server.patch(`/barcode/upload/${id}`, photos, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res;
};

export const updateClaimStatus = async (data) => {
  const res = await server.patch(
    `/admin/update/claim-status/${data.id}`,
    { claimStatus: data.value },
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
  return res;
};

export const removePhoto = async (id, photo) => {
  const res = await server.patch(
    `/barcode/remove/${id}`,
    { photo: photo },
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
  return res;
};

export const removeInsuracne = async (id, insurance) => {
  const res = await server.patch(
    `/barcode/remove-insurance/${id}`,
    { insurance: insurance },
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
  return res;
};

export const scanBarcode = async (barcode, selectedInsurance) => {
  const res = await server.post(
    `/barcode/scan/`,
    { barcode: barcode, buttons: selectedInsurance },
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
  return res;
};

export const deleteBarcode = async (id) =>
  await server.delete(`/barcode/delete/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

export const userCounts = async (userId) =>
  await server.get(`/admin/user-count/${userId}`);
