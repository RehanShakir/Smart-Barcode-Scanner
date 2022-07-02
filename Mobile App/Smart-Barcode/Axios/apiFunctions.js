import server from "./index";

import { getToken } from "../Redux/localstorage";

export const getAllUsersData = async () =>
  server.get("/admin/all-users", {
    headers: {
      Authorization: `Bearer ${await getToken()}`,
    },
  });

export const getOneUser = async (id) =>
  await server.get(`/admin/user/${id.id}`, {
    headers: {
      Authorization: `Bearer ${await getToken()}`,
    },
  });

export const getCounts = async () =>
  server.get("/admin/count", {
    headers: {
      Authorization: `Bearer ${await getToken()}`,
    },
  });

export const statusUpdate = async (data) =>
  server.patch(
    `/admin/update-status/${data.id}`,
    { status: data.value },
    {
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
    }
  );

export const getScannedData = async () =>
  server.get("/admin/scanned-data", {
    headers: {
      Authorization: `Bearer ${await getToken()}`,
    },
  });

export const getScannedDataLoggedInUser = async () =>
  server.get("/barcode/data", {
    headers: {
      Authorization: `Bearer ${await getToken()}`,
    },
  });

export const getScannedCountLoggedInUser = async () =>
  server.get("/barcode/count", {
    headers: {
      Authorization: `Bearer ${await getToken()}`,
    },
  });

export const updateProfile = async (data) =>
  server.patch("/auth/update-profile", data, {
    headers: {
      Authorization: `Bearer ${await getToken()}`,
    },
  });

export const assignButtons = async (data, id) =>
  server.patch(
    `/admin/update-buttons/${id}`,
    { assignedButtons: data },
    {
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
    }
  );

export const userScannedData = async (data) => {
  const d = await server.get(`/admin/user-scanned-data/${data.id}`, {
    headers: {
      Authorization: `Bearer ${await getToken()}`,
    },
  });
  return d;
};

export const claimInsurance = async (data, id) => {
  const res = await server.post(`/barcode/claim/${id}`, data, {
    headers: {
      Authorization: `Bearer ${await getToken()}`,
    },
  });
  return res;
};

export const uploadPhotos = async (photos, id) => {
  const res = await server.patch(`/barcode/upload/${id}`, photos, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${await getToken()}`,
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
        Authorization: `Bearer ${await getToken()}`,
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
        Authorization: `Bearer ${await getToken()}`,
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
        Authorization: `Bearer ${await getToken()}`,
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
        Authorization: `Bearer ${await getToken()}`,
      },
    }
  );
  return res;
};

export const deleteBarcode = async (id) =>
  await server.delete(`/barcode/delete/${id}`, {
    headers: {
      Authorization: `Bearer ${await getToken()}`,
    },
  });

export const userCounts = async (userId) =>
  await server.get(`/admin/user-count/${userId}`);
